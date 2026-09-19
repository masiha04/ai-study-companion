const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const generateAnswer = async (
    question,
    context
) => {

    const prompt = `
You are an AI Study Tutor.

Your job is to help the student understand the
learning material provided below.

IMPORTANT RULES:

1. Use the provided learning material as your
   primary source.

2. Do not invent facts that are not supported
   by the material.

3. If the material does not contain enough
   information, clearly say so.

4. Explain concepts in a beginner-friendly way.

5. Do not mention internal retrieval systems.

Learning material:

${context}

Student question:

${question}
`;

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: [

                {
                    role: "system",

                    content:
                        "You are a helpful, grounded AI Study Tutor."
                },

                {
                    role: "user",

                    content: prompt
                }

            ],

            temperature: 0.2

        });

    return completion
        .choices[0]
        .message
        .content;
};


const generateStructuredJSON = async (
    prompt
) => {

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: [

                {
                    role: "system",

                    content:
                        "Return valid JSON only. Do not use markdown."
                },

                {
                    role: "user",

                    content: prompt
                }

            ],

            temperature: 0.2,

            response_format: {
                type: "json_object"
            }

        });

    return JSON.parse(
        completion.choices[0].message.content
    );
};


module.exports = {
    generateAnswer,
    generateStructuredJSON
};