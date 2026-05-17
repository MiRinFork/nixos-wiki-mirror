<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Manual of Style -->

<strong>This Manual of Style</strong> (hereinafter referred to as <strong>"MoS"</strong> or <strong>"MOS"</strong>) is designed to ensure that all content on the NixOS Wiki is presented in a clear and consistent manner. It provides guidelines on language usage, article structure, formatting, and other stylistic elements to maintain a high standard of quality across the wiki. This guide is intended for all contributors, whether they are new to editing or have extensive experience, to assist them in creating content that is both informative and accessible.

Technical writing is a skill that gets better with practice. This Manual of Style will help editors do that. It's OK to try to stick to it for the most part at first. A wiki thrives on all users helping each other to create better content.

Editors should compose articles using language that is clear, concise, and readily comprehensible. Articles must be organized with consistent, reader-friendly layouts and formatting, as delineated in this guide.

Any new content incorporated into this page must directly address a persistently recurring style issue.

## Rules of thumb

- <strong>Use common sense:</strong> Always apply logic and reason when contributing to the wiki.
- <strong>Cite reliable sources:</strong> Aim to ensure that all information added is verifiable and comes from reliable sources.
- <strong>Maintain neutrality:</strong> Strive to present information in a neutral and unbiased manner.
- <strong>Be clear and concise:</strong> Use clear, concise, and grammatically correct language to ensure readability and understanding.
- <strong>Follow site guidelines:</strong> Adhere to the site's guidelines and policies at all times.
- <strong>Avoid edit wars:</strong> Engage in constructive discussions to resolve content disputes rather than engaging in edit wars.
- <strong>Protect privacy:</strong> Do not share personal information about yourself or others without consent.
- <strong>Contribute constructively:</strong> Aim to improve the quality of the content and the overall user experience.
- <strong>Use proper formatting:</strong> Follow the wiki's formatting guidelines to ensure consistency and readability.
- <strong>Stay on topic:</strong> Ensure that contributions are relevant to the subject matter of the page.
- <strong>Report issues:</strong> Report any issues or inappropriate behavior to the administrators promptly.
- <strong>Be patient and helpful:</strong> Assist new users and be patient with those who are still learning the ropes.
- <strong>Respect others:</strong> Treat all users with respect and courtesy. Personal attacks and harassment are strictly prohibited.
- <strong>No advertising, vandalism, or spamming:</strong> Contributions should be constructive and relevant. Any form of advertising, vandalism, or spamming will not be tolerated.
- **Stay on topic:** This wiki is only about NixOS, Nixpkgs, Nix and the Nix-ecosystem.

## Content policy

### Plagiarizing

Plagiarizing involves using someone else’s work without proper attribution and presenting it as your own. This practice is strictly prohibited on this wiki.

- <strong>Definition:</strong> Plagiarism includes copying text, images, or other media without crediting the original source.
- <strong>Consequences:</strong> Plagiarized content will be removed immediately. Contributors who repeatedly plagiarize may be banned.
- <strong>Prevention:</strong> Always cite your sources. Use quotation marks for direct quotes and provide proper references. Don't just copy&paste a single sentence, but change it at least a little.

### Vandalism

Vandalism refers to any act of deliberately adding false or misleading information, deleting content, or otherwise compromising the integrity of the wiki.

- <strong>Types of vandalism:</strong> This includes adding false information, deleting pages, inserting inappropriate content, and spamming links.
- <strong>Response:</strong> Vandalized pages will be promptly reverted to their previous state. Persistent vandals will be blocked from editing.
- <strong>Reporting:</strong> Users are encouraged to report vandalism immediately.

### Spam and advertisement

Spamming and advertising are prohibited to keep the wiki free from clutter and irrelevant content.

- <strong>Definition:</strong> Spam includes repetitive content, irrelevant links, and advertisements for external products or services.
- <strong>Detection:</strong> Automated filters and manual reviews help identify and remove spam.
- <strong>Action:</strong> Spammers will have their content removed and may be banned from editing. Legitimate contributions should not include promotional content.

### Unofficial wikis

Hostility towards other wikis is not tolerated. Editors who make hostile comments about other wikis will be warned and may be blocked.

- <strong>Linking to other wikis:</strong> Linking to other wikis is not prohibited if such links contribute to the quality of the content.
- <strong>Contribution recommendation:</strong> It is recommended that editors only contribute to one wiki at a time to ensure they do not inadvertently violate the copyright policies of the wikis they edit.

## Article titles, headings, and sections

Article titles and section headings should reflect the content they contain. Titles and section headings should be concise and precise. Titles should be consistent with the titles of related content.

### Article titles

Article titles should be clear and descriptive, providing a succinct summary of the article's content. Avoid using jargon or overly technical terms unless they are widely understood within the context of the wiki. Titles should be formatted in sentence case with capitalizing only the first letter of the first word.

- <strong>Consistency:</strong> Ensure that article titles are consistent with the titles of related content to maintain a cohesive structure across the wiki.
- <strong>Avoid redundancy:</strong> Do not include unnecessary words or phrases that do not add value to the title.

### Section organization

Proper section organization is crucial for creating well-structured, easily navigable articles. A logical and consistent structure helps readers find information quickly and understand the content more effectively.

#### Hierarchy and structure

- Use a clear hierarchy of headings to organize content:

` * Level 2 (==) for main sections`  
` * Level 3 (===) for subsections`  
` * Level 4 (====) for sub-subsections`  
` * Avoid going deeper than level 4 unless absolutely necessary`

- Begin each article with an introduction (without a heading) that summarizes the topic.

<!-- -->

- Arrange sections in a logical order, typically following this pattern:

` 1. Introduction (the introduction has no heading)`  
` 2. Installation`  
` 3. Configuration`  
` 4. Tips and tricks`  
` 5. Troubleshooting`  
` 6. See also`  
` 7. References`

#### Standard section structure (applications)

For consistency across the wiki, use the following structure where applicable:

``` text
(Introduction)

== Installation ==
==== Shell ====
==== System setup ====

== Configuration ==
==== Basic ====
==== Advanced ====

== Tips and tricks ==

== Troubleshooting ==

== See also ==

== References ==
```

#### Flexibility

While consistency is important, remember that different topics may require different structures. Use your judgment to adapt the standard structure when necessary, always prioritizing clarity for the reader.

### Section headers

Section headers should be concise and accurately reflect the content of the section. They should provide a clear indication of what the reader can expect to find in that section.

- <strong>Clarity:</strong> Use clear and descriptive language for section headers. Avoid vague or ambiguous terms.
- <strong>Consistency:</strong> Maintain consistency in the formatting and style of section headers throughout the article.

### Length restrictions

Be mindful of length restrictions when crafting titles and section headings. Excessively long names can make navigation difficult and negatively impact readability.

- <strong>Limit characters:</strong> Section headings should ideally remain under 40 characters.
- <strong>Conciseness:</strong> Strive for brevity without sacrificing clarity. Consider rephrasing complex ideas or breaking them down into multiple sections.

## Text formatting

Proper text formatting is essential for maintaining consistency, readability, and professionalism across the NixOS Wiki. This section outlines the guidelines for various text formatting elements to ensure a uniform presentation of information.

#### Title of works

When referencing titles of various works, follow these guidelines:

- <strong>Articles, blog posts, and short stories:</strong> Use double quotation marks
  - Example: "Understanding Nix Flakes", "The NixOS installation guide"

<!-- -->

- <strong>Software names, tools, and commands:</strong> Use regular text, typically with initial capitalization
  - Example: Nix, NixOS, Nixpkgs, nix-shell

<!-- -->

- <strong>Website names:</strong> Use regular text without quotes or italics
  - Example: Visit the NixOS website for more information.

When in doubt, prioritize clarity and consistency within the article.

#### Quotations

Proper quotation formatting helps distinguish cited material from original content:

- <strong>Short quotes (less than 40 words):</strong> Use double quotation marks ("") and incorporate into the text.
  - Example: According to the documentation, "NixOS is a Linux distribution built on top of the Nix Package Manager."

<!-- -->

- <strong>Long quotes (40 words or more):</strong> Use block quotes by indenting the entire quote or using the <strong>blockquote</strong> tag.

<!-- -->

- <strong>Quotes within quotes:</strong> Use single quotation marks (') for the inner quote.
  - Example: "The developer explained, 'Nix provides a purely functional approach to package management,' which revolutionized the field."

<!-- -->

- <strong>Citations:</strong> Always provide a source for quotations, either inline or as a footnote.
  - Example: "NixOS offers reproducible builds"\[1\].

<!-- -->

- <strong>Alterations and omissions:</strong> Use square brackets \[\] to indicate changes or additions to quotes, and ellipsis (...) for omissions.
  - Example: "NixOS \[provides\] a unique approach to ... configuration management."

#### Capital letters

Proper capitalization improves readability and maintains a professional appearance:

- <strong>Article titles:</strong> Use sentence case, capitalizing only the first word.
  - Example: Installing NixOS on a virtual machine

<!-- -->

- <strong>Section headers:</strong>
  - Main sections (==): Use sentence case
  - Subsections (===, ====): Use sentence case
- <strong>Proper nouns:</strong> Always capitalize names of specific people, places, organizations, and NixOS-specific components.
  - Example: Nix, NixOS, Nixpkgs, Eelco Dolstra

<!-- -->

- <strong>Common nouns:</strong> Do not capitalize unless they are part of an official name or at the beginning of a sentence.
  - Example: "Every distribution has a package manager." but "Nix Package Manager"

<!-- -->

- <strong>Acronyms and initialisms:</strong> Generally use all caps, but follow official styling if different.
  - Example: RAM, CPU, NixOS (not NIXOS)

#### Boldface

Use bold text sparingly to emphasize important information:

- <strong>First mention:</strong> Bold the first occurrence of the article's main topic in the introduction.
  - Example: \<strong\>NixOS\</strong\> is a Linux distribution built on top of the Nix package manager.

<!-- -->

- <strong>Key terms:</strong> Use bold for important terms being defined.
  - Example: A '''derivation''' in Nix is a description of how to build a package.

<!-- -->

- <strong>User interface elements:</strong> Bold names of buttons, menu items, or other UI elements.
  - Example: Click the <strong>Save</strong> button to apply your changes.

<!-- -->

- <strong>Avoid overuse:</strong> Do not use bold for entire sentences or paragraphs, as this reduces its effectiveness.

#### Italic

Italic text serves several purposes in technical writing:

- <strong>Emphasis:</strong> Use italics to stress particular words when appropriate.
  - Example: It is <strong>*crucial*</strong> to back up your configuration before making major changes.

<!-- -->

- <strong>Non-English words:</strong> Italicize words or phrases from languages other than the primary language of the article.
  - Example: In programming, we often use the term <strong>*de facto*</strong> to describe widely accepted standards.

<!-- -->

- <strong>Do not italicize:</strong> Proper names, technical terms after their first use, or entire paragraphs.

#### Spacing

Consistent spacing improves readability and maintains a clean appearance:

- <strong>Single space after periods:</strong> Use only one space after a period at the end of a sentence.

<!-- -->

- <strong>No spaces around slashes:</strong> In constructions like "and/or" or "TCP/IP", do not add spaces around the slash.

<!-- -->

- <strong>Space after commas:</strong> Always include a space after a comma, but not before.

<!-- -->

- <strong>Lists:</strong> Add a space after the list marker (\*, \#) in bulleted or numbered lists.

<!-- -->

- <strong>Parentheses:</strong> No spaces inside parentheses, but do use spaces outside when in a sentence.
  - Example: NixOS (a Linux distribution) offers many advantages.

<!-- -->

- <strong>Code blocks:</strong> Use consistent indentation within code blocks for readability.

#### Numbers and dates

Consistent formatting of numbers and dates is crucial for clarity:

- <strong>Numbers:</strong>
  - Spell out numbers zero through nine in prose.
  - Use numerals for 10 and above.
  - Use commas for numbers with four or more digits (e.g., 1,000, 10,000).
  - Use dots as decimal separator (e.g. 1,000.23 )
  - For very large numbers, consider using words (e.g., 1 million instead of 1,000,000).

<!-- -->

- <strong>Percentages:</strong> Use the % symbol with numerals (e.g., 50%), but spell out "percent" when the number is also spelled out (e.g., five percent).

<!-- -->

- <strong>Dates:</strong>
  - Use the format: Month Day, Year (e.g., January 1, 2024).
  - For numeric dates, use ISO 8601 format: YYYY-MM-DD (e.g., 2024-01-01).

<!-- -->

- <strong>Time:</strong>
  - Use 24-hour clock format to avoid ambiguity (e.g., 14:30 instead of 2:30 PM).
  - Include the time zone when relevant (e.g., 14:30 UTC).

<!-- -->

- <strong>Software versions:</strong>
  - Software versions are subject to change. Only add software versions when required by the content.

#### Abbreviations

Proper use of abbreviations ensures clarity while maintaining brevity:

- <strong>First use:</strong> When first using an abbreviation, write out the full term followed by the abbreviation in parentheses.
  - Example: The Nix Expression Language (NEL) is used to define packages.

<!-- -->

- <strong>Common abbreviations:</strong> Well-known abbreviations (e.g., RAM, CPU) don't need to be spelled out on first use.

<!-- -->

- <strong>Plurals of abbreviations:</strong> Add 's' without an apostrophe (e.g., SSDs, not SSD's).

<!-- -->

- <strong>Periods in abbreviations:</strong>
  - Generally, omit periods in abbreviations (e.g., PhD, AM/PM).
  - Use periods for lowercase abbreviations (e.g., i.e., etc.).

<!-- -->

- <strong>Units of measurement:</strong> Use standard abbreviations without periods (e.g., 5 GB, 10 MHz).

#### Grammar and punctuation

Correct grammar and punctuation are essential for clear communication:

- <strong>Comma usage:</strong>
  - Use the Oxford comma in lists of three or more items.

<!-- -->

- <strong>Semicolons:</strong> Use to separate closely related independent clauses or in complex lists.

<!-- -->

- <strong>Colons:</strong> Use to introduce lists or explanations.

<!-- -->

- <strong>Hyphens and dashes:</strong>
  - Use hyphens (-) for compound modifiers (e.g., well-known package).
  - Use en dashes (–) for ranges (e.g., 5–10 minutes).
  - Use em dashes (—) for parenthetical thoughts—like this one—in sentences.

<!-- -->

- <strong>Parentheses:</strong> Use sparingly to include additional information without disrupting the flow of the sentence.

<!-- -->

- <strong>Quotation marks:</strong> Place periods and commas inside quotation marks. Place other punctuation outside unless it's part of the quoted material.

<!-- -->

- <strong>Active voice:</strong> Prefer active voice over passive voice for clearer, more direct writing.

#### Wording and tone

Maintain a consistent and appropriate tone throughout the wiki:

- <strong>Formal but approachable:</strong> Strike a balance between professional and friendly.

<!-- -->

- <strong>Clarity:</strong> Use clear, concise language. Avoid jargon unless necessary, and explain technical terms.

<!-- -->

- <strong>Objectivity:</strong> Present information neutrally, avoiding bias or personal opinions.

<!-- -->

- <strong>Consistency:</strong> Maintain consistent terminology throughout articles and across the wiki.

<!-- -->

- <strong>International audience:</strong> Consider that readers may not be native English speakers. Avoid colloquialisms or culture-specific references.

<!-- -->

- <strong>Direct address:</strong> Use "you" to address the reader directly when providing instructions or explanations.

#### Common examples of tone

Here are some examples of appropriate and inappropriate tone:

- <strong>Appropriate:</strong> "To install NixOS, follow these steps carefully."
- <strong>Inappropriate:</strong> "Installing NixOS is super easy! Here's how to do it."

<!-- -->

- <strong>Appropriate:</strong> "If you encounter an error, consult the troubleshooting section."
- <strong>Inappropriate:</strong> "If you get an error, check the solution below!"

Remember, the goal is to provide clear, helpful information in a professional manner.

## Vocabulary

Consistent use of terminology is crucial for maintaining clarity across the NixOS Wiki. This section outlines key terms and their preferred usage:

- <strong>Nix:</strong> The package manager and build system at the core of NixOS.
- <strong>NixOS:</strong> The Linux distribution built on top of the Nix package manager.
- <strong>Nixpkgs:</strong> The collection of packages available for Nix and NixOS.
- <strong>Derivation:</strong> A description of how to build a package in Nix.
- <strong>Expression:</strong> A piece of Nix code that describes how to build something.
- <strong>Channel:</strong> A versioned set of Nix expressions and binaries.
- <strong>Flake:</strong> A newer way to package Nix code with explicit dependencies and outputs.
- <strong>Attribute:</strong> A named value in a Nix expression, often used to refer to packages or configuration options.
- <strong>Configuration.nix:</strong> The main configuration file for a NixOS system.

When using these terms:

- Be consistent in capitalization (e.g., always "NixOS", never "Nixos" or "NIXOS").
- Use the full term on first mention, followed by any abbreviation in parentheses if it will be used later.

## Linking

Proper linking improves navigation and provides additional context for readers. This section covers different types of links used in the NixOS Wiki.

#### Wikilinks

Wikilinks are internal links to other pages within the NixOS Wiki.

- Use double square brackets to create a wikilink:
  ``` mediawiki
  [[Page Name]]
  ```
- If the link text should differ from the page name, use a pipe character:
  ``` mediawiki
  [[Page Name|displayed text]]
  ```
- For section links, use a hash symbol. Please note: Section headings are sometimes changed during editing - it may be overlooked to change all the necessary references to them as well. Section links should therefore be used sparingly:
  ``` mediawiki
  [[Page Name#Section Name]]
  ```

#### External linking

External links point to resources outside the NixOS Wiki.

- Use single square brackets for external links:
  ``` mediawiki
  [https://example.com Link text]
  ```
- If no link text is provided, the URL itself will be displayed:
  ``` mediawiki
  [https://example.com]
  ```
- For bare URLs, no brackets are needed:
  ``` mediawiki
  https://example.com
  ```

#### Category links

Category links help organize pages into groups.

- Add category links at the bottom of the page:
  ``` mediawiki
  [[Category:Category Name]]
  ```
- Multiple categories can be added to a single page.
- To link to a category page without adding the current page to that category, use a colon before "Category":
  ``` mediawiki
  [[:Category:Category Name]]
  ```

## Images

Images can greatly improve the content of wiki articles. When using images, follow these guidelines:

- **File types:** Use PNG for screenshots and diagrams, JPEG for photographs, and SVG for logos and icons when available.
- **Size:** Keep file sizes reasonable. Aim for under 1MB for most images.
- **Alt text:** Always provide descriptive alt text for accessibility.
- **Captions:** Use clear, concise captions to describe the image content.
- **Alignment:** Generally, align images to the right of text unless a different alignment better serves the content.

To add an image:

``` mediawiki
[[File:Example.png|thumb|right|250px|Alt text: Description of image content]]
```

#### Image file names

Proper image file naming helps with organization and searchability:

- **Descriptive names:** Use clear, descriptive file names (e.g., "nixos-installation-partitioning.png").
- **Lowercase:** Use lowercase letters to avoid case-sensitivity issues.
- **Hyphens:** Use hyphens (-) to separate words, not underscores or spaces.
- **Avoid special characters:** Stick to alphanumeric characters and hyphens.
- **Version numbers:** If updating an image, consider adding a version number (e.g., "nixos-logo-v2.svg").

Examples of good file names:

- nixos-boot-screen.png
- package-management-diagram.svg
- user-home-directory-structure.jpg

## Videos

Videos can be a valuable addition to wiki articles, especially for tutorials or demonstrations. Follow these guidelines:

- <strong>Relevance:</strong> Only include videos that directly support the article's content.
- <strong>Linking:</strong> Use reputable video hosting platforms (e.g., YouTube, Vimeo) to link videos.
- <strong>Permissions:</strong> Ensure you have the right to use and link the video content.
- <strong>Captions:</strong> Include a descriptive caption below the video.
- <strong>Alternative:</strong> Always provide a text-based alternative or summary of the video content within the article.

## Lists

Lists help organize information in a clear, readable format. The NixOS Wiki uses two types of lists:

### Unordered lists

Use asterisks (\*) for bullet points. Indent with additional asterisks for nested lists.

``` mediawiki
* First item
* Second item
** Subitem 1
** Subitem 2
* Third item
```

### Ordered lists

Use hash symbols (#) for numbered lists. Indent with additional hash symbols for nested lists.

``` mediawiki
# First step
# Second step
## Substep 1
## Substep 2
# Third step
```

### List guidelines

- Use sentence case for list items.
- Be consistent with punctuation (either use periods at the end of all items or none).
- Keep list items parallel in structure.
- Avoid mixing ordered and unordered lists unless necessary for clarity.

## Tables

Tables are useful for presenting structured data. Here's how to create and format tables in the NixOS Wiki:

### Basic table structure

Use the following syntax to create a basic table:

``` mediawiki
{| class="wikitable" style="text-align: center; width: 500px;"
|-
! Header 1 !! Header 2 !! Header 3
|-
| Row 1, Cell 1 || Row 1, Cell 2 || Row 1, Cell 3
|-
| Row 2, Cell 1 || Row 2, Cell 2 || Row 2, Cell 3
|}
```

Writers who use the GUI editor must then add (using the „Edit source“ mode):

``` mediawiki
style="text-align: center; width: 500px;"
```

### Table formatting

- Use `class="wikitable"` for consistent styling.
- Start each row with `|-`
- Use `!` for header cells and `|` for regular cells.
- Align cell content using `style="text-align: left/center/right;"`

### Table guidelines

- Keep tables simple and easy to read.
- Use headers to clearly describe the content of each column.
- Avoid excessive use of tables when prose or lists would suffice.
- For complex tables, consider using additional CSS classes or inline styles for better formatting.​​​​​​​​​​​​​​​​

## Translation

Translating wiki content is crucial for making information accessible to a global audience. Proper translation not only conveys information accurately but also respects cultural nuances.

### General principles

- <strong>Accuracy:</strong> Strive for translations that faithfully represent the original content without altering meaning or omitting information.
- <strong>Clarity:</strong> Prioritize clear, understandable language over literal translations.
- <strong>Consistency:</strong> Maintain consistent terminology and style across all translated pages.
- <strong>Cultural sensitivity:</strong> Be mindful of cultural differences and adapt content appropriately.

### Translation process

#### Preparation

- <strong>Familiarize:</strong> Read the entire original article to understand context and technical terms.
- <strong>Research:</strong> Identify established translations for NixOS-specific terms in your target language.
- <strong>Tools:</strong> Machine translation is allowed for a general foundation, but it must be reviewed.

#### Translation

- <strong>Translate content:</strong> Begin with the main body of the article.
- <strong>Maintain structure:</strong> Preserve the original article's structure and formatting.
- <strong>Technical terms:</strong> Use glossaries for consistent translation of technical terms.
- <strong>Proper nouns:</strong> Generally, do not translate names of tools, projects, or people.

#### Review and refinement

- <strong>Self-review:</strong> Proofread your translation for accuracy and fluency.
- <strong>Peer review:</strong> If possible, have a native speaker review the translation.
- <strong>Technical review:</strong> Ensure technical accuracy, especially for code snippets and commands.

### Language-specific guidelines

- Maintain a separate page for language-specific translation guidelines.
- Address unique challenges or conventions for each language.
- Provide guidance on translating or adapting idiomatic expressions.

### Handling untranslatable content

- <strong>Code snippets:</strong> Generally, do not translate code. Provide translated comments if necessary.
- <strong>Commands:</strong> Keep command syntax unchanged, but translate descriptions and explanations.

### Metadata and navigation

- <strong>Page titles:</strong> Use translated titles, but include the original title in parentheses.
- <strong>Categories:</strong> Create and use translated category names.
- <strong>Interlanguage links:</strong> Add appropriate interlanguage links to connect corresponding articles across languages.

### Quality assurance

- Regularly review and update translations to ensure they remain accurate and up-to-date.
- Encourage feedback from readers and act on suggestions for improvement.
- Conduct periodic audits of translated content to maintain overall quality and consistency.

## Templates

Templates are pre-formatted pieces of content that can be reused across multiple pages. They help maintain consistency and reduce repetitive work. For a detailed list of templates, see <a href="Help:Template" class="wikilink" title="Help:Template">Help:Template</a>.

### Common templates

- <strong>Warning:</strong> A warning box used to report potential danger.
- <strong>Note:</strong> A note box used to emphasize important information.
- <strong>Tip:</strong> A tip box used to share helpful hints.
- <strong>Expansion:</strong> An expansion flag used to indicate incomplete articles.

### Using templates

To use a template, enclose its name in double curly braces:

``` mediawiki
{{TemplateName}}
```

For templates with parameters:

``` mediawiki
{{TemplateName|parameter1=value1|parameter2=value2}}
```

#### Template markup

When creating new templates:

- Use clear, descriptive names for templates.
- Document the purpose and usage of the template on its talk page.
- Use <strong><noinclude></strong> tags for content that should only appear on the template page itself.

## References

Proper referencing is crucial for maintaining the credibility and verifiability of wiki content. Follow these guidelines for references:

### Citation styles

- Use inline citations with numbered references:

``` mediawiki
This is a statement that needs a reference.<ref>Author Name, "Article Title", Publication, Date. URL</ref>
```

- For multiple uses of the same reference, use named references:

``` mediawiki
First use of the reference.<ref name="example">Author Name, "Article Title", Publication, Date. URL</ref>
...
Later use of the same reference.<ref name="example" />
```

### General guidelines

- Prefer primary sources and official documentation when available.
- Avoid referencing personal blogs or unreliable sources.
- For software-specific information, link to the official documentation or repository.
- When referencing specific versions of software, include the version number in the citation.

<a href="Category:Contributions" class="wikilink" title="Category:Contributions">Category:Contributions</a>
