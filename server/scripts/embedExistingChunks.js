require("dotenv").config();

const connectDB =
    require("../config/db");

const Chunk =
    require("../models/Chunk");

const {
    generateEmbedding
} =
    require("../services/embeddingService");


const run = async () => {

    try {

        await connectDB();

        const chunks =
            await Chunk.find({
                $or: [
                    {
                        embedding: {
                            $exists: false
                        }
                    },
                    {
                        embedding: {
                            $size: 0
                        }
                    }
                ]
            });


        console.log(
            `Found ${chunks.length} chunks`
        );


        for (
            const chunk
            of chunks
        ) {

            console.log(
                `Embedding chunk ${chunk.chunkIndex}...`
            );


            chunk.embedding =
                await generateEmbedding(
                    chunk.text
                );


            await chunk.save();

        }


        console.log(
            "All existing chunks embedded."
        );


        process.exit(0);

    } catch (error) {

        console.error(
            error
        );

        process.exit(1);

    }

};


run();