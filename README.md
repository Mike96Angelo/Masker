# Masker
A simple JavaScript library for masking HTML input fields.


example:

```
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


$('input[type="tel"]').on('keydown', telMask.keydownListener());
$('input[type="tel"]').on('focus', telMask.focusListener());
$('input[type="tel"]').on('blur', telMask.blurListener());
```
