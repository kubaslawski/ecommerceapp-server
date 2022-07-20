const {db} = require("../utils/admin");

const config = require("../utils/config");

const {initializeApp} = require("firebase/app");
initializeApp(config);

const {createUserWithEmailAndPassword, getAuth} = require("firebase/auth");

const {noImgUrl} = require("../utils/globalVariables");
const {validateSignUpData} = require("../utils/validators");

exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let token;
    let userId;

    const {valid, errors} = validateSignUpData(newUser);
    if (!valid) return res.status(400).json(errors);

    db.doc(`/users/${newUser.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                errors.handle.push("This handle is already taken");
                return res.status(400).json(errors);
            } else {
                const auth = getAuth();
                return createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: noImgUrl,
                userId,
            };
            console.log(newUser.handle);
            return db.doc(`users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch((err) => {
            switch (err.code) {
            case "auth/email-already-in-use":
                errors.email.push("Email already in use");
                return res.status(400).json(errors);
            case "auth/weak-password":
                errors.password.push("Password is too weak");
                return res.status(400).json(errors);
            default: return res.status(500).json({message: err.code});
            }
        });
};
