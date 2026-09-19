const mongoose = require("mongoose");


const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        answer: {
            type: String,
            default: ""
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        score: {
            type: Number,
            default: 0
        },

        feedback: {
            type: String,
            default: ""
        },

        concept: {
            type: String,
            required: true
        }
    }
);


const assessmentSchema =
    new mongoose.Schema(
        {
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
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
            },

            answers: {
                type: [answerSchema],
                default: []
            },

            totalScore: {
                type: Number,
                default: 0
            },

            percentage: {
                type: Number,
                default: 0
            }
        },
        {
            timestamps: true
        }
    );


module.exports =
    mongoose.model(
        "Assessment",
        assessmentSchema
    );