# MaskerJS

[![GitHub release](https://img.shields.io/github/release/Mike96angelo/Masker.svg?maxAge=21600)](https://github.com/Mike96Angelo/Masker/releases)
[![npm version](https://img.shields.io/npm/v/maskerjs.svg?maxAge=21600)](https://www.npmjs.com/package/maskerjs)
[![npm downloads](https://img.shields.io/npm/dm/maskerjs.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=maskerjs&from=2017-01-28)
[![npm downloads](https://img.shields.io/npm/dt/maskerjs.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=maskerjs&from=2017-01-28)

A simple JavaScript library for masking HTML input fields.

### Install:
```
$ npm install maskerjs
```
# What MaskerJS Looks Like

* [Docs](docs/maskerjs.md)
* [JSFiddle](https://jsfiddle.net/fypyk2jp/4/)

### app.html:

```html
<input id="tel" type="tel" placeholder="+1-234-567-8900">
```

### app.js:

```JavaScript
var Masker = require('maskerjs');

var telMask = new Masker(
    [
        '___-____',            // local
//      '____-____',           // local 8
        '(___) ___-____',      // area
//      '(__) ____-____',      // area 8
        '+_-___-___-____',     // international
//      '+_-__-____-____',     // international 8
    ],
    /^[0-9]$/ // allowed chars
);

var telInput = document.getElementById('tel');

telMask.bind(telInput);
// telMask.unbind(telInput);

var val = telMask.unmask(telInput.value).text;

```
