const router = require("express").Router();
const ChatController = require("../Controllers/ChatController");

router.post("/", ChatController.create);
router.get("/:userId", ChatController.findUserChats);
router.get("/find/:firstId/:secondId", ChatController.findChat);

module.exports = router;
