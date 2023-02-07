const jwt = require("jsonwebtoken");

class TokenController {
    create(_id) {
        const jwtKey = process.env.JWT_SECRET_KEY;

        return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
    }
}

module.exports = new TokenController();
