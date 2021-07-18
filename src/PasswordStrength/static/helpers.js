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
