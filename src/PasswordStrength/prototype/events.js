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
