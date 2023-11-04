const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [
        {
            text: { type: String, required: true },
            sender: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

module.exports = mongoose.model("Messages", MessagesSchema);
