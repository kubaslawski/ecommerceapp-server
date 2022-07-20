const functions = require("firebase-functions");

const app = require("express")();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const {
    signUp,
    login,
    addUserDetails,
} = require("./api/users");

// user routes
app.post("/signup", signUp);
app.post("/login", login);
app.post("user", addUserDetails);

exports.api = functions.region("europe-central2").https.onRequest(app);

