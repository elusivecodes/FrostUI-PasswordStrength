import $ from '@fr0st/query';
import { BaseComponent } from '@fr0st/ui';

/**
 * PasswordStrength Class
 * @class
 */
export default class PasswordStrength extends BaseComponent {
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
