<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Module:User:Layer-09/Sandbox/Command -->

local p = {}

function p.main(frame)

`   local parent = frame:getParent()`  
`   local args = parent.args`  
`   `  
`   local content = args[1] or ''`  
`   local type = mw.text.trim(args.type or 'command')`  
`   `  
`   -- Handle empty content`  
`   if content == '' then`  
`       return '`

<div class="mw-command-block">

<em>No command specified</em>

</div>

'

`   end`  
`   `  
`   local lines = mw.text.split(content, '\n')`  
`   local is_multiline = #lines > 1`  
`   `  
`   -- Create the main container`  
`   local root = mw.html.create('div')`  
`   root:addClass('mw-command-block')`  
`   `  
`   -- Add the copy button`  
`   local copyButton = root:tag('button')`  
`   copyButton:addClass('mw-copy-button')`  
`       :attr('type', 'button')`  
`       :attr('title', 'Copy to clipboard')`  
`       :wikitext('Copy')`  
`       `  
`   -- Create the area for all code lines`  
`   local codeArea = root:tag('div')`  
`   codeArea:addClass('mw-code-area')`  
`   `  
`   -- Loop through each line and build the structure`  
`   for i, line in ipairs(lines) do`  
`       local line_container = codeArea:tag('div')`  
`       line_container:addClass('mw-code-line')`  
`       `  
`       -- Build the prefix string`  
`       local prefix_str = ''`  
`       if is_multiline then`  
`           prefix_str = string.format('%2d', i) -- Right-align line numbers`  
`       end`  
`       `  
`       if type == 'command' then`  
`           if is_multiline then`  
`               prefix_str = prefix_str .. '  $ '`  
`           else`  
`               prefix_str = '$ '`  
`           end`  
`       elseif is_multiline then`  
`           prefix_str = prefix_str .. '   ' -- Add spacing for alignment`  
`       end`  
`       `  
`       -- Create the prefix span`  
`       if prefix_str ~= '' then`  
`           line_container:tag('span')`  
`               :addClass('mw-code-prefix')`  
`               :wikitext(prefix_str)`  
`       end`  
`       `  
`       -- Create the code element`  
`       local code_element = line_container:tag('code')`  
`       code_element:addClass('mw-code-text')`  
`       `  
`       -- Handle empty lines properly`  
`       if mw.text.trim(line) == '' then`  
`           code_element:wikitext('​') -- Zero-width space to maintain line height`  
`       else`  
`           -- Clean up the line and add it`  
`           local clean_line = line:gsub('^%s+', `*`):gsub('%s+$',`*`) -- Trim whitespace`  
`           code_element:wikitext(line) -- Keep original spacing`  
`       end`  
`   end`  
`   `  
`   return tostring(root)`

end

return p
