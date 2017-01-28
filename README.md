# MaskerJS
A simple JavaScript library for masking HTML input fields.


* [JSFiddle](https://jsfiddle.net/fypyk2jp/1/)

### Example

app.html:

```html
<input id="tel" type="tel" placeholder="+1 (234) 567-8900">
```

app.js:

```JavaScript
var Masker = require('maskerjs');

var telMask = new Masker(
    [
        '+_ (___) ___-____',
        '+_-___-____-____',
        '+_-____-____-____',
        '+__-____-____-____',
        '+___-____-____-____'
    ],
    /^[0-9]$/ // allowed chars
);

var telInput = document.getElementById('tel');

telMask.bind(telInput);
// telMask.unbind(telInput);

var val = telMask.unmask(telInput.value).text;

```
