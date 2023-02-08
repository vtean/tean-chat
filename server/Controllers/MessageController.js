const messageModel = require("../Models/MessageModel");
const chatModel = require("../Models/ChatModel");

class MessageModel {
    async addMessage(req, res) {
        const { chatId, senderId, text } = req.body;

        const chat = await chatModel.findById(chatId);
        if (!chat) return res.status(400).json("Chat not found.");

        const message = new messageModel({
            chatId,
            senderId,
            text,
        });

        try {
            const response = await message.save();
            res.status(200).json(response);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async getMessages(req, res) {
        const { chatId } = req.params;

        try {
            const messages = await messageModel.find({ chatId });
            res.status(200).json(messages);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }

    async getLastMessages(req, res) {
        const { userId } = req.params;

        try {
            // get all chats where user is a participant
            const chats = await chatModel.find({ members: { $in: [userId] } });

            const chatsId = chats.map((chat) => chat._id);

            // get only the last message from each chat, not repeating chats
            const lastMessages = [];

            for (let i = 0; i < chatsId.length; i++) {
                const chatId = chatsId[i];
                const message = await messageModel.findOne({ chatId }).sort({ createdAt: -1 });

                if (message) {
                    lastMessages.push(message);
                } else {
                    const chat = chats.find((chat) => chat._id === chatId);
                    lastMessages.push(chat);
                }
            }

            res.status(200).json(lastMessages);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
}

module.exports = new MessageModel();
