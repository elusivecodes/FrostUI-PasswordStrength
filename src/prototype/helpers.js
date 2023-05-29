import $ from '@fr0st/query';

/**
 * Refresh the password strength.
 */
export function _refresh() {
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
        class: this.constructor.classes.progressBar,
        'aria-valuenow': strength,
    });

    $.addClass(this._progressBar, nextLevel.class);

    if (this._options.striped) {
        $.addClass(this._progressBar, this.constructor.classes.progressBarStriped);
    }

    if (nextLevel.text) {
        $.setText(this._progressBar, nextLevel.text);
    }
};
