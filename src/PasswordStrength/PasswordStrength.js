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

        dom.addEvent(this._node, 'input.ui.passwordstrength', _ => {
            this._refresh();
        });
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
