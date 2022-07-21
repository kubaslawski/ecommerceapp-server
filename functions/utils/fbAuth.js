const {admin} = require("./admin");
const {db} = require("./config");

module.exports = (req, res, next) => {
    let idToken;
    const errors = {
        general: [],
    };
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        errors.general.push("Unauthorized");
        return res.status(403).json(errors);
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db.collection("users")
                .where("userId", "==", req.user.uid)
                .limit(1)
                .get();
        })
        .then((data) => {
            req.user.handle = data.docs[0].data().handle;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch(() => {
            errors.general.push("Error while verifying token");
            return res.status(403).json(errors);
        });
};
