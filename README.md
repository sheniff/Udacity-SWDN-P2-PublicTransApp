# Project 2 : Public Transportation App
## Udacity : Senior Web Developer Nanodegree

### How to run it
`$> npm i` to install all dependencies and libraries via bower (automatically run as postinstall dependency)

`$> grunt serve` command runs local server and lifts the app

`$> grunt serve:dist` command runs local server with the compiled app (use this one for service worker to work as it caches compiled assets)

`$> grunt dist` builds dist package, ready to deploy

`$> grunt publish` builds package and publish it to github-pages

### Demos (and [live demo](https://sheniff.github.io/Udacity-SWDN-P2-PublicTransApp/))
![udacity_p2](https://cloud.githubusercontent.com/assets/1939291/14584228/540324e8-03f1-11e6-9a8b-e706f4d143f8.gif)

### Features
* [x] Is responsive. Based on Material design for better looking.
* [x] Works offline.
  * It uses service workers, cache and idb to cache as much content as possible to serve in case of low/no connection.
  * It decreases fetched times automatically even when offline to show more accurate times even with no/bad connection.
* [x] Build process. It uses Grunt to build the app as requested.

### Libraries and technologies I used
For this second project, I wanted to focus on the new features of service workers and idb, which add enough complexity on their own as to explore any other new framework. Therefore, I opted for Angular for this project as I already knew it well.
* Grunt + plugins (for task automation)
* AngularJS
* AngularMaterial for styling
* IDBPromise library as suggested
* HTML5 Promises
