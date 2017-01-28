# Masker
A simple JavaScript library for masking HTML input fields.


example:

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
