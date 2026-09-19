const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["mcq", "open"],
            required: true
        },

        options: {
            type: [String],
            default: []
        },

        correctAnswer: {
            type: String,
            default: ""
        },

        explanation: {
            type: String,
            default: ""
        },

        concept: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: [
                "easy",
                "medium",
                "hard"
            ],
            default: "medium"
        }
    }
);


const quizSchema = new mongoose.Schema(
    {
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

        questions: {
            type: [questionSchema],
            default: []
        },

        status: {
            type: String,
            enum: [
                "generated",
                "completed"
            ],
            default: "generated"
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Quiz", quizSchema);