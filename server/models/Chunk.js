const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },

        chunkIndex: {
            type: Number,
            required: true
        },

        pageNumber: {
            type: Number,
            default: null
        },

        embedding: {
            type: [Number],
            default: []
        },

        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Chunk = mongoose.model("Chunk", chunkSchema);

module.exports = Chunk;