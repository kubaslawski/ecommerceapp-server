const functions = require("firebase-functions");

const app = require("express")();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const {
    signUp,
} = require("./api/users");

app.post("/signup", signUp);

exports.api = functions.region("europe-central2").https.onRequest(app);
