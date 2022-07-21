const functions = require("firebase-functions");

const app = require("express")();
const FbAuth = require("./utils/fbAuth");
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const {
    signUp,
    login,
    addUserDetails,
    getAuthenticatedUser,
} = require("./api/users");

// user routes
app.get("/user", FbAuth, getAuthenticatedUser);
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user", FbAuth, addUserDetails);

exports.api = functions.region("europe-central2").https.onRequest(app);

