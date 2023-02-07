const chatModel = require("../Models/ChatModel");

class ChatController {
    async create(req, res) {
        const { firstId, secondId } = req.body;

        try {
            const chat = await chatModel.findOne({
                members: { $all: [firstId, secondId] },
            });

            if (chat) return res.status(200).json(chat);

            const newChat = new chatModel({
                members: [firstId, secondId],
            });

            const response = await newChat.save();
            res.status(200).json(response);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async findUserChats(req, res) {
        const userId = req.params.userId;

        try {
            const chats = await chatModel.find({
                members: { $in: [userId] },
            });
            res.status(200).json(chats);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async findChat(req, res) {
        const { firstId, secondId } = req.params;

        try {
            const chat = await chatModel.findOne({
                members: { $all: [firstId, secondId] },
            });
            res.status(200).json(chat);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
}

module.exports = new ChatController();
