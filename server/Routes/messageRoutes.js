const router = require("express").Router();
const MessageController = require("../Controllers/MessageController");

router.post("/", MessageController.addMessage);
router.get("/last", MessageController.getLastMessages);
router.get("/:chatId", MessageController.getMessages);

module.exports = router;
