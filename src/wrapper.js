/**
 * FrostUI-PasswordStrength v1.0.5
 * https://github.com/elusivecodes/FrostUI-PasswordStrength
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        factory(global);
    }

})(window, function(window) {
    'use strict';

    if (!window) {
        throw new Error('FrostUI-PasswordStrength requires a Window.');
    }

    if (!('UI' in window)) {
        throw new Error('FrostUI-PasswordStrength requires FrostUI.');
    }

    const Core = window.Core;
    const dom = window.dom;
    const UI = window.UI;

    // {{code}}
});