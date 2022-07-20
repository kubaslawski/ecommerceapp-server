const {db} = require("../utils/admin");

const config = require("../utils/config");

const {initializeApp} = require("firebase/app");
initializeApp(config);

const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
} = require("firebase/auth");

const auth = getAuth();

const {noImgUrl} = require("../utils/globalVariables");
const {
    validateSignUpData,
    validateLoginData,
    reduceUserDetails,
} = require("../utils/validators");

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

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const {valid, errors} = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);
    signInWithEmailAndPassword(auth, user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            switch (err.code) {
            case "auth/wrong-password":
                errors.general.push("Wrong credentials, please try again");
                return res.status(400).json(errors);
            case "auth/invalid-email":
                return res.status(400).json(errors);
            default: return res.status(500).json({error: err.code});
            }
        });
};

exports.addUserDetails = (req, res) => {
    const userDetails = reduceUserDetails(req.body);

    db.doc(`users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({message: "Details added successfully"});
        })
        .catch((err) => {
            return res.status(500).json({error: err.code});
        });
};
