To test on a php server:
- go to Hamsterdam117.github.io directory in command line
-- cd "OneDrive\Documents\jonathanallen.uk website\Hamsterdam117.github.io"
- php  -S 0.0.0.0:8888 -t ./
- visit http://localhost:8888/ in browser

To change home page intro:
- modify src/PageBuilder.php

To add a new page:
- Add a new page to the json folder within src (content is written as an array where each item is a line of html)
- The name is not used so can be anything (but number at the start ensures correct order)
- go to src directory in command line
-- cd "OneDrive\Documents\jonathanallen.uk website\Hamsterdam117.github.io\src"
- php WebBuilder.php "commit message for github"
- if there is no commit message for github, the website will not upload
- changes may take a few minutes to appear on the site
- Any changes to "style.css" will require a CTRL+F5 of the browser to see the changes
- Any images should have the extentions in lower case

The "testLayout.html" file within src is an empty page that can be used to write the page and
see how it looks as you go without needing to rebuild.

Page building functions that can be used directly from the json file as a line:
- "buildSectionSeparator()"

