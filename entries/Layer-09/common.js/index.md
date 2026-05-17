<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Layer-09/common.js -->

// Add copy-to-clipboard functionality for the Command sandbox template \$(function () {

`   $(document.body).on('click', '.mw-copy-button', function() {`  
`       var button = $(this);`  
`       var block = button.closest('.mw-command-block');`  
`       var source = block.find('.mw-copy-source');`

`       if (!source.length) return;`

`       navigator.clipboard.writeText(source.val()).then(function() {`  
`           var originalText = button.text();`  
`           button.text('Copied!');`  
`           button.prop('disabled', true);`  
`           setTimeout(function() {`  
`               button.text(originalText);`  
`               button.prop('disabled', false);`  
`           }, 2000);`  
`       }).catch(function(err) {`  
`           console.error('Failed to copy text: ', err);`  
`           alert('Could not copy text. Please do it manually.');`  
`       });`  
`   });`

});
