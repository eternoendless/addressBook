# Address Book

This is a simple address book manager written in javascript as a single-page, client-side web application.

## Installation

1. Checkout the source code from GitHub

2. Install npm dependencies

        $> npm install
        
3. Run gulp init
 
        $> gulp init
        
4. (Optional) Run gulp connect to set up a web server on port 4000

        $> gulp connect
        
5. Done! If you ran gulp connect on step 4, you can now open the application on
        
        http://localhost:4000
        
   Otherwise, you can simply open `</path/to/repo>/public/index.html`   
   
## Possible future improvements

- Stop Babel from including its functions more than once
- Better merging of external resources (css, js)
- Use Uglify to compress the output code
- Better error handling
- Load screens (eg. spinning wheel)
- Avoid unnecessary reflows
- Add pagination

## Tech / libraries used

- SASS
- NPM
- Bower
- Gulp
- jQuery
- Babel
- Bootstrap
- Handlebars.js
- Navigo (by Krasimir Tsonev)
- jQuery Confirm 2 (by craftpip)