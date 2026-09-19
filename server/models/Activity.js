const mongoose = require("mongoose");


const activitySchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            project: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project"
            },

            type: {
                type: String,
                required: true
            },

            metadata: {
                type: mongoose.Schema.Types.Mixed,
                default: {}
            }
        },
        {
            timestamps: true
        }
    );


module.exports =
    mongoose.model(
        "Activity",
        activitySchema
    );