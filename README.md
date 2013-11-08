Sails.js Grunt Scaffold
=======================

An alternative [Sails.js](http://sailsjs.org/) Grunt scaffold which enables live-reload for both the server and the client (via Nodemon and contrib-watch), substitutes LESS for [SASS](http://sass-lang.com/), script concatenation for [Browserify](http://browserify.org/), sets up a basic grunt-mocha task for [Mocha](http://visionmedia.github.io/mocha/) tests as well as provides a number of commonly used front-end libraries located in `vendor` --the [Gumby SASS framework](http://gumbyframework.com/), [jQuery](http://jquery.com/), [Backbone](http://backbonejs.org/), [Lo-dash](http://lodash.com/), [GreenSock Animation Platform](http://www.greensock.com/), and [Modernizer](http://modernizr.com/).

Installation
-------------

- Initialize a new Sails app by running `sails new <app>`
- Clone `https://github.com/damassi/sails-js-scaffold.git` into the newly created app folder, overwriting the existing package.json and GruntFile.js.
- Install dependencies:  `npm install`
- Start app:  `grunt concurrent`

(Note:  grunt concurrent is used instead of `sails lift` due to the need to both restart the server on changes as well as watch for file changes on the frontend)


Configuring Scaffold
--------------------

Currently the Sails framework requires that three Grunt tasks tasks be included by default:  `linkAssets`, `build` and `prod`.  While `linkAssets` no longer needs to be used as the default `sails-linker` npm module has been removed, `build` and `prod` still need to be configured depending upon your desired build and production needs.  I've left these intentionally blank.  Additionally, if certain vendor libraries are not needed you can remove them from the `concat:vendor` task located at the top of the grunt-file.


Configuring Base Views
----------------------

In `views/layout.ejs` the base, default view used to render Sails.js pages can be modified to fit your needs.  If the paths to your application sources needs to be changed, then the base-paths located at the top of GruntFile.js need to be changed accordingly.


