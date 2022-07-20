const isStrEmpty = (str) => {
    return str.trim() === "";
};

const isStrEmail = (str) => {
    const regEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
    return str.match(regEx);
};

const areArraysInObjectEmpty = (obj) => {
    Object.keys(obj).every(function(key) {
        if (obj[key].length !== 0) {
            return false;
        }
    });
    return true;
};

exports.validateSignUpData = (data) => {
    const errors = {
        email: [],
        handle: [],
        password: [],
        confirmPassword: [],
    };

    if (isStrEmpty(data.email)) {
        errors.email.push("Must not be empty");
    }

    if (!isStrEmail(data.email)) {
        errors.email.push("Must be a valid email address");
    }

    if (isStrEmpty(data.password)) {
        errors.password.push("Must not be empty");
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword.push("Passwords must match");
    }

    if (isStrEmpty(data.handle)) {
        errors.handle.push("Must not be empty");
    }

    return {
        errors,
        valid: areArraysInObjectEmpty(errors),
    };
};
