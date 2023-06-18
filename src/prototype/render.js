import $ from '@fr0st/query';
import { generateId } from '@fr0st/ui';

/**
 * Render the password strength element.
 */
export function _render() {
    this._progress = $.create('div', {
        class: this.constructor.classes.progress,
    });

    const id = generateId('password-strength');

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
};
