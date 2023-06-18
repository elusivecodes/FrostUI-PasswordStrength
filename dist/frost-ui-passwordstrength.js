(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fr0st/ui'), require('@fr0st/query')) :
    typeof define === 'function' && define.amd ? define(['exports', '@fr0st/ui', '@fr0st/query'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UI = global.UI || {}, global.UI, global.fQuery));
})(this, (function (exports, ui, $) { 'use strict';

    /**
     * PasswordStrength Class
     * @class
     */
    class PasswordStrength extends ui.BaseComponent {
        /**
         * New PasswordStrength constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the PasswordStrength with.
         */
        constructor(node, options) {
            super(node, options);

            if (this._options.container) {
                this._container = $.findOne(this._options.container);
            } else {
                this._container = $.closest(this._node, ':not(.form-input):not(.input-group)');
            }

            this._render();
            this._refresh();
            this._events();
        }

        /**
         * Dispose the PasswordStrength.
         */
        dispose() {
            $.remove(this._progress);
            $.removeEvent(this._node, 'input.ui.passwordstrength');
            $.removeAttribute(this._node, 'aria-describedby');

            this._container = null;
            this._progress = null;
            this._progressBar = null;

            super.dispose();
        }

        /**
         * Get the password strength.
         * @return {number} The password strength. (0, 100)
         */
        getStrength() {
            const value = $.getValue(this._node);

            return this.constructor.getStrength(value);
        }
    }

    /**
     * Attach events for the PasswordStrength.
     */
    function _events() {
        $.addEvent(this._node, 'input.ui.passwordstrength', (_) => {
            this._refresh();
        });
    }

    /**
     * Refresh the password strength.
     */
    function _refresh() {
        const strength = this.getStrength();

        let nextLevel;
        for (const level of this._options.levels) {
            if (strength < level.score) {
                break;
            }

            nextLevel = level;
        }

        $.setStyle(this._progressBar, { width: `${strength}%` });
        $.setAttribute(this._progressBar, {
            'class': this.constructor.classes.progressBar,
            'aria-valuenow': strength,
        });

        $.addClass(this._progressBar, nextLevel.class);

        if (this._options.striped) {
            $.addClass(this._progressBar, this.constructor.classes.progressBarStriped);
        }

        if (nextLevel.text) {
            $.setText(this._progressBar, nextLevel.text);
        }
    }

    /**
     * Render the password strength element.
     */
    function _render() {
        this._progress = $.create('div', {
            class: this.constructor.classes.progress,
        });

        const id = ui.generateId('password-strength');

        this._progressBar = $.create('div', {
            attributes: {
                'id': id,
                'role': 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': 100,
            },
        });

        $.append(this._progress, this._progressBar);
        $.append(this._container, this._progress);

        $.setAttribute(this._node, {
            'aria-describedby': id,
        });
    }

    /**
     * Find character sequences in a string.
     * @param {string} string The input string.
     * @param {array} locations The character locations.
     * @return {array} The character sequences.
     */
    function findSequences(string, locations) {
        const sequences = [];
        let sequence = [];

        for (let i = 0; i < locations.length - 1; i++) {
            const current = locations[i];
            const next = locations[i + 1];
            const distance = next - current;

            const char = string[current];
            const nextChar = string[next];
            const charDistance = nextChar.charCodeAt(0) - char.charCodeAt(0);

            if (distance === 1 && charDistance === 1) {
                if (!sequence.length) {
                    sequence.push(char);
                }
                sequence.push(nextChar);
            } else if (sequence.length) {
                sequences.push(sequence);
                sequence = [];
            }
        }

        if (sequence.length) {
            sequences.push(sequence);
        }

        return sequences;
    }
    /**
     * Get the strength of a password.
     * @param {string} password The password.
     * @return {number} The password strength.
     */
    function getStrength(password) {
        if (password.match(/^password/i)) {
            password = password.substring(8);
        }

        const length = password.length;

        let score = 0;

        if (length) {
            score += length * 6;
        }

        const upper = [];
        const lower = [];
        const numbers = [];
        const symbols = [];
        const dictionary = {};

        for (let i = 0; i < length; i++) {
            const char = password[i];
            const code = char.charCodeAt(0);

            if (code >= 48 && code <= 57) {
                numbers.push(i);
            } else if (code >= 65 && code <= 90) {
                upper.push(i);
            } else if (code >= 97 && code <= 122) {
                lower.push(i);
            } else {
                symbols.push(i);
            }

            if (!(char in dictionary)) {
                dictionary[char] = 0;
            }

            dictionary[char]++;
        }

        // reward upper/lower case
        if (upper.length !== length && lower.length !== length) {
            if (upper.length) {
                score += length - upper.length;
            }

            if (lower.length) {
                score += length - lower.length;
            }
        }

        // reward numbers
        if (numbers.length !== length) {
            score += numbers.length * 3;
        }

        // reward symbols
        score += symbols.length * 6;

        // reward inner numbers/symbols
        for (const list of [numbers, symbols]) {
            const reward = list.filter((v) => v && v !== length - 1).length;
            score += reward * 3;
        }

        // punish only letters
        if (!numbers.length && !symbols.length) {
            score -= length;
        }

        // punish only numbers
        if (!upper.length && !lower.length && !symbols.length) {
            score -= length;
        }

        // punish no symbols
        if (!symbols.length) {
            score -= length;
        }

        // repeating characters
        const repeats = Object.values(dictionary)
            .reduce((acc, count) => acc + count - 1, 0);

        if (repeats > 0) {
            score -= repeats;
        }

        if (length >= 2) {
            // consecutive characters
            const matches = password.matchAll(/(.)\1+/g);

            for (const match of matches) {
                score -= Math.min(match[0].length, 12) * 3;
            }

            const lowerPassword = password.toLowerCase();

            // sequential letters
            const letters = upper.concat(lower);
            const letterSequences = findSequences(lowerPassword, letters);
            for (const sequence of letterSequences) {
                if (sequence.length > 2) {
                    score -= (Math.min(sequence.length - 2, 16)) * 3;
                }
            }

            // sequential numbers
            const numberSequences = findSequences(lowerPassword, numbers);
            for (const sequence of numberSequences) {
                if (sequence.length > 2) {
                    score -= (Math.min(sequence.length - 2, 16)) * 3;
                }
            }
        }

        return $._clamp(score, 0, 100);
    }

    // PasswordStrength default options
    PasswordStrength.defaults = {
        levels: [
            {
                score: 0,
                class: 'text-bg-danger',
                text: 'Very Weak',
            },
            {
                score: 20,
                class: 'text-bg-danger',
                text: 'Weak',
            },
            {
                score: 40,
                class: 'text-bg-warning',
                text: 'Normal',
            },
            {
                score: 60,
                class: 'text-bg-success',
                text: 'Strong',
            },
            {
                score: 80,
                class: 'text-bg-success',
                text: 'Very Strong',
            },
        ],
        container: null,
        striped: false,
    };

    // PasswordStrength classes
    PasswordStrength.classes = {
        progress: 'progress mt-2',
        progressBar: 'progress-bar',
        progressBarStriped: 'progress-bar-striped',
    };

    // PasswordStrength static
    PasswordStrength.getStrength = getStrength;

    // PasswordStrength prototype
    const proto = PasswordStrength.prototype;

    proto._events = _events;
    proto._refresh = _refresh;
    proto._render = _render;

    // PasswordStrength init
    ui.initComponent('passwordstrength', PasswordStrength);

    exports.PasswordStrength = PasswordStrength;

}));
//# sourceMappingURL=frost-ui-passwordstrength.js.map
