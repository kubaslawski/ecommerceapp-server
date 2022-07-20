module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    rules: {
        "indent": ["error", 4],
        "max-len": ["error", 200],
        "quotes": ["error", "double"],
        "linebreak-style": ["error", "windows"],
    },
};
