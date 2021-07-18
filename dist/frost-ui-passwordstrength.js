/**
 * FrostUI-PasswordStrength v1.0.13
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

    /**
     * PasswordStrength Class
     * @class
     */
    class PasswordStrength extends UI.BaseComponent {

        /**
         * New PasswordStrength constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [settings] The options to create the PasswordStrength with.
         * @returns {PasswordStrength} A new PasswordStrength object.
         */
        constructor(node, settings) {
            super(node, settings);

            if (this._settings.container) {
                this._container = dom.findOne(this._settings.container);
            } else {
                this._container = dom.closest(this._node, ':not(.form-input):not(.input-group)');
            }

            this._render();
            this._refresh();
            this._events();
        }

        /**
         * Dispose the PasswordStrength.
         */
        dispose() {
            dom.remove(this._progress);
            dom.removeEvent(this._node, 'input.ui.passwordstrength');

            this._container = null;
            this._progress = null;
            this._progressBar = null;

            super.dispose();
        }

        /**
         * Get the password strength.
         * @returns {number} The password strength. (0, 100)
         */
        getStrength() {
            const value = dom.getValue(this._node);
            return this.constructor.getStrength(value, this._settings);
        }

    }


    /**
     * PasswordStrength Events
     */

    Object.assign(PasswordStrength.prototype, {

        /**
         * Attach events for the PasswordStrength.
         */
        _events() {
            dom.addEvent(this._node, 'input.ui.passwordstrength', _ => {
                this._refresh();
            });
        }

    });


    /**
     * PasswordStrength Render
     */

    Object.assign(PasswordStrength.prototype, {

        /**
         * Refresh the password strength.
         */
        _refresh() {
            const strength = this.getStrength();

            let nextLevel;
            for (const level of this._settings.levels) {
                if (strength < level.score) {
                    break;
                }

                nextLevel = level;
            }

            dom.setStyle(this._progressBar, 'width', `${strength}%`);
            dom.setAttribute(this._progressBar, 'aria-valuenow', strength);
            dom.setAttribute(this._progressBar, 'class', this.constructor.classes.progressBar);

            if (this._settings.striped) {
                dom.addClass(this._progressBar, this.constructor.classes.progressBarStriped);
            }

            dom.addClass(this._progressBar, nextLevel.class);

            if (nextLevel.text) {
                dom.setText(this._progressBar, nextLevel.text);
            }
        },

        /**
         * Render the password strength element.
         */
        _render() {
            this._progress = dom.create('div', {
                class: this.constructor.classes.progress
            });

            this._progressBar = dom.create('div', {
                attributes: {
                    role: 'progressbar',
                    'aria-valuemin': 0,
                    'aria-valuemax': 100
                }
            });

            dom.append(this._progress, this._progressBar);
            dom.append(this._container, this._progress);
        }

    });


    /**
     * PasswordStrength (Static) API
     */

    Object.assign(PasswordStrength, {

        /**
         * Get the strength of a password.
         * @param {string} password The password.
         * @param {object} [options] The options to calculate the strength.
         * @returns {number} The password strength.
         */
        getStrength(password, options) {
            options = Core.extend({}, {
                ...options,
                ...this.strengthDefaults
            });

            if (options.commonPasswords.includes(password)) {
                return 0;
            }

            const length = password.length;

            if (length < options.minLength) {
                return 0;
            }

            let score = length * options.lengthMultiplier;

            let upperCount = 0;
            let lowerCount = 0;
            let numberCount = 0;
            let symbolCount = 0;

            const upperChars = [];
            const lowerChars = [];
            const numberChars = [];
            const symbolChars = [];
            const dictionary = {};

            for (let i = 0; i < length; i++) {
                const char = password[i];
                const code = char.charCodeAt(0);

                // number
                if (code >= 48 && code <= 57) {
                    numberCount++;
                    numberChars.push(i);
                    // upper case
                } else if (code >= 65 && code <= 90) {
                    upperCount++;
                    upperChars.push(i);
                    // lower case
                } else if (code >= 97 && code <= 122) {
                    lowerCount++;
                    lowerChars.push(i);
                    // symbol
                } else {
                    symbolCount++;
                    symbolChars.push(i);
                }

                if (!dictionary[char]) {
                    dictionary[char] = 1;
                } else {
                    dictionary[char]++;
                }
            }

            // reward upper/lower case
            if (upperCount !== length && lowerCount !== length) {
                if (upperCount !== 0) {
                    score += (length - upperCount) * options.upperLowerMultiplier;
                }

                if (lowerCount !== 0) {
                    score += (length - lowerCount) * options.upperLowerMultiplier;
                }
            }

            // reward numbers
            if (numberCount !== length) {
                score != numberCount * options.numberMultiplier;
            }

            // reward symbols
            score += symbolCount * options.symbolMultiplier;

            // reward inner numbers/symbols
            for (const list of [numberChars, symbolChars]) {
                const reward = list.filter(v => v && v !== length - 1).length;
                score += reward * options.innerMultiplier;
            }

            // punish characters
            if (upperCount + lowerCount === length) {
                score -= length;
            }

            // punish numbers
            if (numberCount === length) {
                score -= length;
            }

            // repeating characters
            const repeats = Object.values(dictionary).reduce((acc, count) => acc + count - 1, 0);
            if (repeats > 0) {
                score -= Math.floor(repeats / (length - repeats)) + 1;
            }

            if (length > 2) {
                // consecutive letters and numbers
                for (const range of [/[a-z]{2,}/g, /[A-Z]{2,}/g, /[0-9]{2,}/g]) {
                    const matches = password.matchAll(range);

                    if (!matches) {
                        continue;
                    }

                    for (const match of matches) {
                        score -= (match[0].length - 1) * options.sequentialMultiplier;
                    }
                }

                const lowerPassword = password.toLowerCase();

                // sequential letters
                const letters = upperChars.concat(lowerChars);
                const letterSequences = this._findSequences(lowerPassword, letters);
                for (const sequence of letterSequences) {
                    if (sequence.length > 2) {
                        score -= (sequence.length - 2) * options.sequentialMultiplier;
                    }
                }

                // sequential numbers
                const numberSequences = this._findSequences(lowerPassword, numberChars);
                for (const sequence of numberSequences) {
                    if (sequence.length > 2) {
                        score -= (sequence.length - 2) * options.sequentialMultiplier;
                    }
                }
            }

            return Core.clamp(score, 0, 100);
        }

    });


    /**
     * PasswordStrength (Static) Helpers
     */

    Object.assign(PasswordStrength, {

        /**
         * Find character sequences in a string.
         * @param {string} string The input string.
         * @param {array} locations The character locations.
         * @returns {array} The character sequences.
         */
        _findSequences(string, locations) {
            const sequences = [];
            let sequence = [];

            for (let i = 0; i < locations.length - 1; i++) {
                const here = locations[i];
                const next = locations[i + 1];
                const distance = next - here;

                const char = string[here];
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

    });


    // PasswordStrength default options
    PasswordStrength.defaults = {
        levels: [
            {
                score: 0,
                class: 'bg-danger',
                text: 'Very Weak'
            },
            {
                score: 20,
                class: 'bg-danger',
                text: 'Weak'
            },
            {
                score: 40,
                class: 'bg-warning',
                text: 'Normal'
            },
            {
                score: 60,
                class: 'bg-success',
                text: 'Strong'
            },
            {
                score: 80,
                class: 'bg-success',
                text: 'Very Strong'
            }
        ],
        container: null,
        striped: false
    };

    // Default Strength Options
    PasswordStrength.strengthDefaults = {
        commonPasswords: [
            'password'
        ],
        innerMultiplier: 4,
        lengthMultiplier: 5,
        minLength: 6,
        numberMultiplier: 3,
        sequentialMultiplier: 1,
        symbolMultiplier: 7,
        upperLowerMultiplier: 2
    };

    // Default classes
    PasswordStrength.classes = {
        progress: 'progress mt-2',
        progressBar: 'progress-bar',
        progressBarStriped: 'progress-bar-striped'
    };

    UI.initComponent('passwordstrength', PasswordStrength);

    UI.PasswordStrength = PasswordStrength;

});