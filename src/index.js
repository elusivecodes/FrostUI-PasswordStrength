import { initComponent } from '@fr0st/ui';
import PasswordStrength from './password-strength.js';
import { _events } from './prototype/events.js';
import { _refresh } from './prototype/helpers.js';
import { _render } from './prototype/render.js';
import { getStrength } from './static/helpers.js';

// PasswordStrength default options
PasswordStrength.defaults = {
    levels: [
        {
            score: 0,
            class: 'text-bg-danger',
            text: 'Very Weak',
        },
        {
            score: 20,
            class: 'text-bg-danger',
            text: 'Weak',
        },
        {
            score: 40,
            class: 'text-bg-warning',
            text: 'Normal',
        },
        {
            score: 60,
            class: 'text-bg-success',
            text: 'Strong',
        },
        {
            score: 80,
            class: 'text-bg-success',
            text: 'Very Strong',
        },
    ],
    container: null,
    striped: false,
};

// PasswordStrength classes
PasswordStrength.classes = {
    progress: 'progress mt-2',
    progressBar: 'progress-bar',
    progressBarStriped: 'progress-bar-striped',
};

// PasswordStrength static
PasswordStrength.getStrength = getStrength;

// PasswordStrength prototype
const proto = PasswordStrength.prototype;

proto._events = _events;
proto._refresh = _refresh;
proto._render = _render;

// PasswordStrength init
initComponent('passwordstrength', PasswordStrength);

export default PasswordStrength;
