const mongoose = require("mongoose");


const recommendationSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            project: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
                required: true
            },

            title: {
                type: String,
                required: true
            },

            reason: {
                type: String,
                required: true
            },

            action: {
                type: String,
                required: true
            },

            priority: {
                type: String,
                enum: [
                    "low",
                    "medium",
                    "high"
                ],
                default: "medium"
            },

            completed: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true
        }
    );


module.exports =
    mongoose.model(
        "Recommendation",
        recommendationSchema
    );