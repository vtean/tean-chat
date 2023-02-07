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
}

module.exports = new MessageModel();
