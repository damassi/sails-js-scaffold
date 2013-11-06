Sails.js Grunt Scaffold
=======================

An alternative Sails.js framework Grunt scaffold which substitutes LESS for SASS, script concatenation for Browserify, sets up a basic grunt-mocha task as well as provides a number of commonly used front-end libraries located in `vendor` --the Gumby SASS framework, jQuery, Backbone, lodash, GreenSock, and Modernizer.

Installation
-------------

- Initialize a new Sails app by running `sails new <app>`
- Clone `https://github.com/damassi/sails-js-scaffold.git` into the newly created app folder, overwriting the existing package.json and GruntFile.js.
- Install dependencies:  `npm install`
- Start app:  `sails lift`


Configuring Scaffold
--------------------

Currently the Sails framework requires that three tasks be included by default:  `linkAssets`, `build` and `prod`.  While `linkAssets` no longer needs to be used as the default `sails-linker` npm module has been removed, `build` and `prod` still need to be configured depending upon your desired build and production needs.  I've left these intentionally blank.  Additionally, if certain vendor libraries are not needed you can remove them from the `concat:vendor` task located at the top of the grunt-file.


Configuring Base Views
----------------------

In `views/layout.ejs` the base, default view used to render Sails.js pages can be modified to fit your needs.  If the paths to your application source needs to be changed, then the base-paths located at the top of GruntFile.js need to be changed accordingly.


