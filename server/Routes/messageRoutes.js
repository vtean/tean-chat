const router = require("express").Router();
const MessageController = require("../Controllers/MessageController");

router.post("/", MessageController.addMessage);
router.get("/last/:userId", MessageController.getLastMessages);
router.get("/unread/:userId", MessageController.getUnreadMessages);
router.post("/readAll/:userId", MessageController.readAllMessages);
router.get("/:chatId", MessageController.getMessages);

module.exports = router;
