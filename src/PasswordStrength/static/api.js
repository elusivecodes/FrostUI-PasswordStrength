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
