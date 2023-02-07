const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const tkn = require("./TokenController");

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            let user = await userModel.findOne({ email });
            if (user) return res.status(400).json("User already exists.");

            if (!name || !email || !password)
                return res.status(400).json("All fields must be completed.");

            if (!validator.isEmail(email)) return res.status(400).json("Invalid email.");
            if (!validator.isStrongPassword(password))
                return res.status(400).json("Please enter a more secure password.");

            user = new userModel({ name, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();

            const token = tkn.create(user._id);
            res.status(200).json({ _id: user._id, name, email, token });
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            let user = await userModel.findOne({ email });

            if (!user) return res.status(400).json("Invalid email or password.");

            const isValidPass = await bcrypt.compare(password, user.password);
            if (!isValidPass) return res.status(400).json("Invalid email or password.");

            const token = tkn.create(user._id);

            res.status(200).json({ _id: user._id, name: user.name, email, token });
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async getOne(req, res) {
        const userId = req.params.userId;

        try {
            const user = await userModel.findById(userId);
            res.status(200).json(user);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async getAll(req, res) {
        try {
            const users = await userModel.find();
            res.status(200).json(users);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
}

module.exports = new UserController();
