const mongoose = require("mongoose");


const materialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        originalName: {
            type: String,
            required: true,
            trim: true
        },

        filePath: {
            type: String,
            required: true
        },

        fileType: {
            type: String,
            required: true
        },

        extractedText: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["queued", "processing", "ready", "failed"],
            default: "queued"
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

const Material = mongoose.model(
    "Material",
    materialSchema
);

module.exports = Material;