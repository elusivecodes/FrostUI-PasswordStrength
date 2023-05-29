import $ from '@fr0st/query';

/**
 * Attach events for the PasswordStrength.
 */
export function _events() {
    $.addEvent(this._node, 'input.ui.passwordstrength', (_) => {
        this._refresh();
    });
};
