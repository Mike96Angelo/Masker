## Table of Contents
- [Masker](#masker)
  - [Class: Masker](#class-masker)
    - [masker.maskVal(value)](#maskermaskvalvalue)
    - [masker.unmaskVal(value)](#maskerunmaskvalvalue)
    - [masker.maskInput(element)](#maskermaskinputelement)
    - [masker.unmaskInput(element)](#maskerunmaskinputelement)
    - [masker.bind(element)](#maskerbindelement)
    - [masker.unbind(element)](#maskerunbindelement)
    - [EventHandler: inputListener(event)](#eventhandler-inputlistenerevent)
    - [EventHandler: keydownListener(event)](#eventhandler-keydownlistenerevent)
  - [Masker.jQueryPlugin(jQuery)](#maskerjquerypluginjquery)
    - [jQuery.mask(masker)](#jquerymaskmasker)
    - [jQuery.mask(patterns, filter)](#jquerymaskpatterns-filter)
    - [jQuery.unmask()](#jqueryunmask)
    - [jQuery.maskVal(masker)](#jquerymaskvalmasker)
    - [jQuery.maskVal(patterns, filter)](#jquerymaskvalpatterns-filter)
    - [jQuery.unmaskVal()](#jqueryunmaskval)

# Masker


# Class: Masker

Example:
```JavaScript
var code4Masker = new Masker('_ _ _ _', /^[0-9]$/);

var telMasker = new Masker(
  [
    '___-____',
    '(___) ___-____',
    '+_-___-___-____'
  ],
  /^[0-9]$/
);
```

# masker.maskVal(value)

Example:
```JavaScript
code4Masker.maskVal('1234');      // '1 2 3 4'

telMasker.maskVal('1234567');     // '123-4567'
telMasker.maskVal('1234567890');  // '(123) 456-7890'
telMasker.maskVal('12345678900'); // '+1-234-567-8900'
```

# masker.unmaskVal(value)

Example:
```JavaScript
code4Masker.unmaskVal('1 2 3 4');       // '1234'

telMasker.unmaskVal('123-4567');        // '1234567'
telMasker.unmaskVal('(123) 456-7890');  // '1234567890'
telMasker.unmaskVal('+1-234-567-8900'); // '12345678900'
```

# masker.maskInput(element)

Example:
```JavaScript
var code4Input = document.getElementById('code4');
code4Masker.maskInput(code4Input);
// code4Input.value '1234' => '1 2 3 4'

var telInput = document.getElementById('tel');
telMasker.maskInput(telInput);
// telInput.value '1234567'     => '123-4567'
// telInput.value '1234567890'  => '(123) 456-7890'
// telInput.value '12345678900' => '+1-234-567-8900'
```

# masker.unmaskInput(element)

Example:
```JavaScript
var code4Input = document.getElementById('code4');
code4Masker.unmaskInput(code4Input);
// code4Input.value '1 2 3 4' => '1234'

var telInput = document.getElementById('tel');
telMasker.unmaskInput(telInput);
// telInput.value '123-4567'        => '1234567'
// telInput.value '(123) 456-7890'  => '1234567890'
// telInput.value '+1-234-567-8900' => '12345678900'
```

# masker.bind(element)

Example:
```JavaScript
var code4Input = document.getElementById('code4');
code4Masker.bind(code4Input);

var telInput = document.getElementById('tel');
telMasker.bind(telInput);
```


# masker.unbind(element)

Example:
```JavaScript
var code4Input = document.getElementById('code4');
code4Masker.unbind(code4Input);

var telInput = document.getElementById('tel');
telMasker.unbind(telInput);
```


# EventHandler: inputListener(event)


# EventHandler: keydownListener(event)


# Masker.jQueryPlugin(jQuery)

Example:
```JavaScript
Masker.jQueryPlugin(jQuery);
```


# jQuery.mask(masker)
Example:
```JavaScript
var telMask = new Masker(
  [
    '___-____',            // local
    '(___) ___-____',      // area
    '+_-___-___-____',     // international
  ],
  /^[0-9]$/ // allowed chars
);

// pass in a Masker object
jQuery('input[type="tel"]').mask(telMask);
```


# jQuery.mask(patterns, filter)
Example:
```JavaScript
// pass in the Masker constructor arguments
jQuery('input[type="tel"]').mask(
  [
    '___-____',            // local
    '(___) ___-____',      // area
    '+_-___-___-____',     // international
  ],
  /^[0-9]$/ // allowed chars
);
```


# jQuery.unmask()
Example:
```JavaScript
// remove the masker
jQuery('input[type="tel"]').unmask();
```


# jQuery.maskVal(masker)
Example:
```JavaScript
var telMask = new Masker(
  [
    '___-____',            // local
    '(___) ___-____',      // area
    '+_-___-___-____',     // international
  ],
  /^[0-9]$/ // allowed chars
);

// pass in a Masker object
var maskedVal = jQuery('input[type="tel"]').maskVal(telMask);
```


# jQuery.maskVal(patterns, filter)
Example:
```JavaScript
// pass in the Masker constructor arguments
var maskedVal = jQuery('input[type="tel"]').maskVal(
  [
    '___-____',            // local
    '(___) ___-____',      // area
    '+_-___-___-____',     // international
  ],
  /^[0-9]$/ // allowed chars
);
```


# jQuery.unmaskVal()
Example:
```JavaScript
var unmaskedVal = jQuery('input[type="tel"]').unmaskVal();
```
