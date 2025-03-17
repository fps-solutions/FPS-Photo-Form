PS C:\Users\dev\Documents\GitHub\SPFx-Image-Form> yo @microsoft/sharepoint

     _-----_
    |       |    ╭──────────────────────────────────────────╮
    |--(o)--|    │ Update available: 5.0.0 (current: 4.3.0) │
   `---------´   │     Run npm install -g yo to update.     │
    ( _´U`_ )    ╰──────────────────────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `


     _-----_     ╭──────────────────────────╮
    |       |    │ Welcome to the Microsoft │
    |--(o)--|    │      365 SPFx Yeoman     │
   `---------´   │     Generator@1.17.3     │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

See https://aka.ms/spfx-yeoman-info for more information on how to use this generator.
Let's create a new Microsoft 365 solution.
? What is your solution name? FPS Photo Form
? Which type of client-side component to create? WebPart
Add new Web part to solution fps-photo-form.
? What is your Web part name? FPS Photo Form
? Which template would you like to use? React

## Installed these pacakges
npm install @mikezimm/fps-library-v2@2.0.17
npm install webpack-bundle-analyzer@4.6.1 --save-dev

## Updated these areas
update tsconfig.json "noUnusedLocals": false,
update tsconfig.json:  "target": "es6",

update bannerTitle in PreConfiguredSettings

######  Add to gitignore ######
# secrets stored locally
storedSecrets

## Next steps
add webpack analyzer into gulpfile.js
gulp build

- npm install exifr --save;  << == Used for getting geoLocations from images
- npm install @mikezimm/fps-library-v2@2.0.132; gulp serve --nobrowser

- gulp clean; gulp build; gulp bundle --ship; gulp package-solution --ship

- npm install @mikezimm/fps-library-v2@2.0.132; gulp clean; gulp build; gulp bundle --ship; gulp package-solution --ship

?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js
- coinfigure-webpack 14s
- typical webpack time:  10-X s