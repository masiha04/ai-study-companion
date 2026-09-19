const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    retrieveRelevantChunks
} = require("../services/retrievalService");

const router = express.Router();


// SEARCH CHUNKS USING SEMANTIC RETRIEVAL

router.get("/:projectId", authMiddleware, async (req, res) => {

    try {

        const { projectId } = req.params;
        const { query } = req.query;

        if (!query || !query.trim()) {

            return res.status(400).json({
                message: "Search query is required"
            });

        }


        // Find the most relevant chunks
        // using embeddings + cosine similarity

        const results = await retrieveRelevantChunks(
            projectId,
            req.userId,
            query,
            5
        );


        return res.status(200).json({

            query,

            results: results.map(item => ({

                id: item.chunk._id,

                text: item.chunk.text,

                score: item.score,

                chunkIndex: item.chunk.chunkIndex,

                pageNumber: item.chunk.pageNumber,

                material: item.chunk.material,

                project: item.chunk.project

            }))

        });

    } catch (error) {

        console.error(
            "Retrieval error:",
            error.message
        );

        return res.status(500).json({

            message:
                "Something went wrong during retrieval"

        });

    }

});


module.exports = router;