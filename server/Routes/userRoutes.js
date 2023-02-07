const router = require("express").Router();
const UserController = require("../Controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/find/:userId", UserController.getOne);
router.get("/", UserController.getAll);

module.exports = router;
