/* The wiki program. Provide a simple markdown-based wiki with a static site generator for easy hosting on GitHub Pages or similar platforms.
// Copyright (C) 2026 MiRinChan
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, see < https://www.gnu.org/licenses/>.
*/

import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const defaultInputPath = path.join(rootDir, "wikidump.xml");
const defaultOutputDir = path.join(rootDir, "entries");

class PandocError extends Error {
  constructor(message, stderr) {
    super(message);
    this.name = "PandocError";
    this.stderr = stderr;
  }
}

function usage() {
  return `Usage: node scripts/import-wikidump.mjs [options]

Options:
  --input <path>         MediaWiki XML dump path. Default: wikidump.xml
  --output <path>        Generated entries directory. Default: entries
  --clean                Remove the output directory before importing
  --namespace <ids>      Comma-separated namespace ids. Default: 0
  --pandoc <command>     Pandoc executable. Default: pandoc
  --help                 Show this message
`;
}

function parseArgs(argv) {
  const options = {
    inputPath: defaultInputPath,
    outputDir: defaultOutputDir,
    clean: false,
    namespaceIds: new Set(["0"]),
    pandocCommand: "pandoc",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help") {
      console.log(usage());
      process.exit(0);
    }

    if (arg === "--clean") {
      options.clean = true;
      continue;
    }

    const readValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      index += 1;
      return value;
    };

    if (arg === "--input") {
      options.inputPath = path.resolve(rootDir, readValue());
    } else if (arg === "--output") {
      options.outputDir = path.resolve(rootDir, readValue());
    } else if (arg === "--namespace") {
      const namespaceIds = readValue().split(",").map((value) => value.trim()).filter(Boolean);
      if (namespaceIds.length === 0) {
        throw new Error("--namespace must include at least one namespace id");
      }
      options.namespaceIds = new Set(namespaceIds);
    } else if (arg === "--pandoc") {
      options.pandocCommand = readValue();
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function decodeXml(value) {
  return String(value)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll("&amp;", "&");
}

function textOf(xml, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = pattern.exec(xml);
  return match ? decodeXml(match[1]) : "";
}

function hasRedirect(pageXml) {
  return /<redirect\b/i.test(pageXml);
}

function normalizePathSegment(segment) {
  return segment
    .replaceAll("\0", "")
    .replace(/[<>:"\\|?*]/g, "-")
    .replace(/[.\s]+$/g, "")
    .trim();
}

function titleToSegments(title) {
  const segments = title
    .split("/")
    .map(normalizePathSegment)
    .filter((segment) => segment && segment !== "." && segment !== "..");

  if (segments.length === 0) {
    return null;
  }

  return segments;
}

function extractPage(pageXml, namespaceIds) {
  const title = textOf(pageXml, "title").trim();
  const namespaceId = textOf(pageXml, "ns").trim();

  if (!title || !namespaceIds.has(namespaceId) || hasRedirect(pageXml)) {
    return null;
  }

  const textMatches = [...pageXml.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)];
  const latestText = textMatches.at(-1)?.[1] ?? "";
  const source = decodeXml(latestText);
  const segments = titleToSegments(title);

  if (!segments) {
    return null;
  }

  return { title, segments, source };
}

function repairMediaWikiSource(source) {
  return source
    .split("\n")
    .map((line) => line.replace(/^([|!][^|\n]*\bstyle="[^"\n|]*)(\|)/, '$1"$2'))
    .join("\n");
}

async function* readPages(inputPath) {
  const stream = createReadStream(inputPath, { encoding: "utf8" });
  let buffer = "";

  for await (const chunk of stream) {
    buffer += chunk;

    while (true) {
      const start = buffer.indexOf("<page>");
      if (start === -1) {
        buffer = buffer.slice(Math.max(0, buffer.length - 16));
        break;
      }

      const end = buffer.indexOf("</page>", start);
      if (end === -1) {
        buffer = buffer.slice(start);
        break;
      }

      const pageEnd = end + "</page>".length;
      yield buffer.slice(start, pageEnd);
      buffer = buffer.slice(pageEnd);
    }
  }
}

async function runPandoc(pandocCommand, source, title) {
  return new Promise((resolve, reject) => {
    const child = spawn(pandocCommand, [
      "--from=mediawiki",
      "--to=gfm",
      "--wrap=none",
      "--markdown-headings=atx",
    ], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      reject(new Error(`Failed to start ${pandocCommand}: ${error.message}`));
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        const trimmedStderr = stderr.trim();
        reject(new PandocError(`pandoc failed for "${title}" with exit code ${code}: ${trimmedStderr}`, trimmedStderr));
      }
    });

    child.stdin.on("error", () => {
      // The process may exit before consuming stdin. The close handler will
      // report that as a pandoc failure and the caller can use the fallback.
    });
    child.stdin.end(source);
  });
}

async function convertPageToMarkdown(options, page) {
  try {
    return {
      markdown: await runPandoc(options.pandocCommand, page.source, page.title),
      usedFallback: false,
    };
  } catch (error) {
    if (!(error instanceof PandocError)) {
      throw error;
    }

    const repairedSource = repairMediaWikiSource(page.source);
    if (repairedSource !== page.source) {
      try {
        console.warn(`WARNING: pandoc failed for "${page.title}", retrying with repaired MediaWiki table attributes.`);
        return {
          markdown: await runPandoc(options.pandocCommand, repairedSource, page.title),
          usedFallback: false,
        };
      } catch (retryError) {
        if (!(retryError instanceof PandocError)) {
          throw retryError;
        }
        console.warn(`WARNING: repaired conversion also failed for "${page.title}": ${retryError.stderr}`);
      }
    } else {
      console.warn(`WARNING: pandoc failed for "${page.title}": ${error.stderr}`);
    }

    return {
      markdown: fallbackMarkdown(page.source),
      usedFallback: true,
    };
  }
}

function fallbackMarkdown(source) {
  const escapedSource = source.replaceAll("```", "`` `");

  return [
    "> [!WARNING]",
    "> Automatic MediaWiki-to-Markdown conversion failed for this page. The raw source from the dump is preserved below.",
    "",
    "```mediawiki",
    escapedSource,
    "```",
  ].join("\n");
}

function generatedMarkdown(title, convertedMarkdown) {
  const body = convertedMarkdown.trim() || "_This page was empty in the source dump._";

  return [
    "<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->",
    "",
    `<!-- Source page: ${title.replaceAll("--", "- -")} -->`,
    "",
    body,
    "",
  ].join("\n");
}

async function writeEntry(outputDir, page, markdown) {
  const entryDir = path.join(outputDir, ...page.segments);
  const targetPath = path.join(entryDir, "index.md");
  await fs.mkdir(entryDir, { recursive: true });
  await fs.writeFile(targetPath, generatedMarkdown(page.title, markdown), "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const temporaryOutputDir = await fs.mkdtemp(path.join(os.tmpdir(), "nixos-wiki-entries-"));
  let imported = 0;
  let skipped = 0;
  let fallbackImported = 0;

  for await (const pageXml of readPages(options.inputPath)) {
    const page = extractPage(pageXml, options.namespaceIds);

    if (!page) {
      skipped += 1;
      continue;
    }

    const { markdown, usedFallback } = await convertPageToMarkdown(options, page);
    await writeEntry(temporaryOutputDir, page, markdown);
    imported += 1;
    if (usedFallback) {
      fallbackImported += 1;
    }

    if (imported % 100 === 0) {
      console.log(`Imported ${imported} pages...`);
    }
  }

  if (options.clean) {
    await fs.rm(options.outputDir, { recursive: true, force: true });
  }

  await fs.mkdir(path.dirname(options.outputDir), { recursive: true });
  await fs.cp(temporaryOutputDir, options.outputDir, { recursive: true, force: true });
  await fs.rm(temporaryOutputDir, { recursive: true, force: true });

  console.log(`Imported ${imported} pages into ${path.relative(rootDir, options.outputDir) || options.outputDir}.`);
  console.log(`Skipped ${skipped} pages outside selected namespaces or redirects.`);
  if (fallbackImported > 0) {
    console.log(`Imported ${fallbackImported} pages with raw-source fallback because pandoc could not parse them.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
