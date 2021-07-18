// PasswordStrength default options
PasswordStrength.defaults = {
    levels: [
        {
            score: 0,
            class: 'bg-danger',
            text: 'Very Weak'
        },
        {
            score: 20,
            class: 'bg-danger',
            text: 'Weak'
        },
        {
            score: 40,
            class: 'bg-warning',
            text: 'Normal'
        },
        {
            score: 60,
            class: 'bg-success',
            text: 'Strong'
        },
        {
            score: 80,
            class: 'bg-success',
            text: 'Very Strong'
        }
    ],
    container: null,
    striped: false
};

// Default Strength Options
PasswordStrength.strengthDefaults = {
    commonPasswords: [
        'password'
    ],
    innerMultiplier: 4,
    lengthMultiplier: 5,
    minLength: 6,
    numberMultiplier: 3,
    sequentialMultiplier: 1,
    symbolMultiplier: 7,
    upperLowerMultiplier: 2
};

// Default classes
PasswordStrength.classes = {
    progress: 'progress mt-2',
    progressBar: 'progress-bar',
    progressBarStriped: 'progress-bar-striped'
};

UI.initComponent('passwordstrength', PasswordStrength);

UI.PasswordStrength = PasswordStrength;
