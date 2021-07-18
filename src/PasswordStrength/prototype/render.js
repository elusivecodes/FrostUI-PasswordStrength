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
