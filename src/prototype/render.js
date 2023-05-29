import $ from '@fr0st/query';

/**
 * Render the password strength element.
 */
export function _render() {
    this._progress = $.create('div', {
        class: this.constructor.classes.progress,
    });

    this._progressBar = $.create('div', {
        attributes: {
            'role': 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
        },
    });

    $.append(this._progress, this._progressBar);
    $.append(this._container, this._progress);
};
