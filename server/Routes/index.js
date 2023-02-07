const router = require("express").Router();

const userRouter = require("./userRoutes");
const chatRouter = require("./chatRoutes");
const messageRouter = require("./messageRoutes");

router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

module.exports = router;
