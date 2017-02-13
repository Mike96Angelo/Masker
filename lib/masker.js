var Generator = require('generate-js');

var Masker = Generator.generate(function Masker(masks, filter) {
    var _ = this;
    _.masks = [];

    for (var i = 0; i < masks.length; i++) {
        _.masks.push({
            length: masks[i].replace(/[^_]/g, '')
                .length,
            mask: masks[i]
        });
    }

    _._filter = filter;

    _.masks.sort(function (a, b) {
        return a - b;
    });

    _.focusListener = _._focusListener();
    _.blurListener = _._blurListener();
    _.keydownListener = _._keydownListener();
});

Masker.definePrototype({
    mask: function mask(val, selectionStart, selectionEnd, maskBlank) {
        var _ = this;

        var rule = _.unmask(val, selectionStart, selectionEnd);

        val = rule.text;
        selectionStart = rule.selectionStart;
        selectionEnd = rule.selectionEnd;

        var s = selectionStart;
        var e = selectionEnd;

        if (!maskBlank && !val.length) {
            return {
                text: '',
                selectionStart: selectionStart
            };
        }

        var mask = _.getMask(val.length);

        var text = '';

        for (var i = 0, j = 0; j <= val.length && i < mask.length; i++) {
            var mText = mask[i];
            var tText = val[j];

            if (mText === '_' && j < val.length) {
                text += tText;
                j++;
            } else if (mText !== '_' && j <= val.length) {
                text += mText;

                if (j <= s) {
                    selectionStart++;
                }

                if (j <= e) {
                    selectionEnd++;
                }
            } else {
                break;
            }
        }

        return {
            text: text,
            selectionStart: selectionStart,
            selectionEnd: selectionEnd,
            selectionDirection: selectionStart <= selectionEnd ? 'forward' : 'backward'
        };
    },

    unmask: function unmask(val, selectionStart, selectionEnd) {
        var _ = this;

        var text = '';
        var s = selectionStart;
        var e = selectionEnd;

        for (var i = 0; i < val.length; i++) {
            if (_.filter(val[i])) {
                text += val[i];
            } else {
                if (i < s) {
                    selectionStart--;
                }

                if (i < e) {
                    selectionEnd--;
                }
            }
        }

        return {
            text: text,
            selectionStart: selectionStart,
            selectionEnd: selectionEnd,
            selectionDirection: selectionStart <= selectionEnd ? 'forward' : 'backward'
        };
    },

    filter: function filter(ch) {
        var _ = this;

        if (typeof _._filter === 'function') {
            return _._filter(ch);
        } else if (_._filter instanceof RegExp) {
            return _._filter.test(ch);
        }

        return true;
    },

    getMask: function getMask(length) {
        var _ = this;

        for (var i = 0; i < _.masks.length; i++) {
            if (_.masks[i].length >= length) {
                return _.masks[i].mask;
            }
        }

        return _.masks[_.masks.length - 1].mask;
    },

    _keydownListener: function _keydownListener() {
        var masker = this;

        return function EVENTS_KEYDOWN(evt) {
            var el = evt.target,
                rule;

            var start = el.selectionStart,
                end = el.selectionEnd,
                val = el.value;

            if (
                evt.metaKey ||
                evt.ctrlKey ||
                evt.keyCode === 13 || // enter
                evt.keyCode === 9 // tab
            ) {
                return;
            } else if (evt.keyCode === 8) { // backspace
                rule = masker.unmask(val, start, end);

                start = rule.selectionStart;
                end = rule.selectionEnd;
                val = rule.text;

                if (start === end) {
                    start = Math.max(start - 1, 0);
                    end = Math.max(end, start);
                }

                val = val.slice(0, start) + val.slice(end);

                end = start;
                evt.preventDefault();
            } else if (masker.filter(String.fromCodePoint(evt.keyCode))) { // allowed chars
                rule = masker.unmask(val, start, end);

                if (
                    rule.text.length < masker.masks[masker.masks.length - 1].length ||
                    rule.selectionStart !== rule.selectionEnd
                ) {
                    start = rule.selectionStart;
                    end = rule.selectionEnd;
                    val = rule.text;

                    start = Math.max(start, 0);
                    end = Math.max(end, start);

                    val = val.slice(0, start) +
                        String.fromCodePoint(evt.keyCode) +
                        val.slice(end);

                    start = Math.min(start + 1, val.length);
                    end = start;
                }

                evt.preventDefault();
            } else if (evt.keyCode === 38 || (evt.metaKey && evt.keyCode === 37)) { // up
                if (evt.shiftKey) {
                    return;
                }

                start = 0;
                end = start;
                evt.preventDefault();
            } else if (evt.keyCode === 40 || (evt.metaKey && evt.keyCode === 39)) { // down
                if (evt.shiftKey) {
                    return;
                }

                start = val.length;
                end = start;
                evt.preventDefault();
            } else if (evt.keyCode === 37) { // left
                if (evt.shiftKey) {
                    return;
                }

                rule = masker.unmask(val, start, end);

                start = rule.selectionStart;
                end = rule.selectionEnd;
                val = rule.text;

                if (start === end) {
                    start = Math.max(start - 1, 0);
                    end = start;
                } else {
                    start = Math.max(0, Math.min(start, end));
                    end = start;
                }

                evt.preventDefault();
            } else if (evt.keyCode === 39) { // right
                if (evt.shiftKey) {
                    return;
                }

                rule = masker.unmask(val, start, end);

                start = rule.selectionStart;
                end = rule.selectionEnd;
                val = rule.text;

                if (start === end) {
                    start = Math.min(start + 1, val.length);
                    end = start;
                } else {
                    start = Math.min(val.length, Math.max(start, end));
                    end = start;
                }

                evt.preventDefault();
            } else {
                evt.preventDefault();
                return;
            }

            rule = masker.mask(val, start, end, true);

            el.value = rule.text;
            el.setSelectionRange(
                rule.selectionStart,
                rule.selectionEnd,
                rule.selectionDirection
            );
        };
    },

    _blurListener: function _blurListener() {
        var masker = this;

        return function EVENTS_BLUR(evt) {
            var el = evt.target;

            var rule = masker.mask(el.value, el.selectionStart, el.selectionEnd);

            el.value = rule.text;
            el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
        };
    },

    _focusListener: function _focusListener() {
        var masker = this;

        return function EVENTS_FOCUS(evt) {
            var el = evt.target;

            var rule = masker.mask(el.value, el.selectionStart, el.selectionEnd,
                true);

            el.value = rule.text;
            el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
        };
    },

    bind: function bind(el) {
        var _ = this;

        el.addEventListener('focus', _.focusListener, false);
        el.addEventListener('blur', _.blurListener, false);
        el.addEventListener('change', _.blurListener, false);
        el.addEventListener('keydown', _.keydownListener, false);

        var rule = masker.mask(el.value, el.selectionStart, el.selectionEnd);

        el.value = rule.text;
        el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
    },

    unbind: function unbind(el) {
        var _ = this;

        el.removeEventListener('focus', _.focusListener, false);
        el.removeEventListener('blur', _.blurListener, false);
        el.removeEventListener('change', _.blurListener, false);
        el.removeEventListener('keydown', _.keydownListener, false);

        var rule = masker.unmask(el.value, el.selectionStart, el.selectionEnd);

        el.value = rule.text;
        el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
    }
});

module.exports = Masker;
