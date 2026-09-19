const Chunk = require("../models/Chunk");
const { generateEmbedding } = require("./embeddingService");
const cosineSimilarity = require("../utils/cosineSimilarity");

const retrieveRelevantChunks = async (
    projectId,
    userId,
    query,
    limit = 5
) => {
    const chunks = await Chunk.find({
        project: projectId,
        user: userId,
        embedding: { $exists: true, $ne: [] }
    });

    if (chunks.length === 0) {
        return [];
    }

    const queryEmbedding = await generateEmbedding(query);

    const scoredChunks = chunks.map((chunk) => ({
        chunk,
        score: cosineSimilarity(
            queryEmbedding,
            chunk.embedding
        )
    }));

    scoredChunks.sort(
        (a, b) => b.score - a.score
    );

    /*
     * Remove duplicate content.
     *
     * The same PDF may have been uploaded more than once,
     * creating different Material IDs with identical chunks.
     *
     * We therefore use normalized chunk text as the
     * duplicate key instead of only material + chunkIndex.
     */
    const uniqueChunks = [];
    const seenContent = new Set();

    for (const item of scoredChunks) {
        const normalizedText = item.chunk.text
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        if (seenContent.has(normalizedText)) {
            continue;
        }

        seenContent.add(normalizedText);
        uniqueChunks.push(item);
    }

    // Apply similarity threshold
    const relevantChunks = uniqueChunks.filter(
        (item) => item.score >= 0.25
    );

    // Return top unique results
    const topChunks = relevantChunks.slice(0, limit);

    console.log(
        "TOP SCORES AFTER DEDUP:",
        topChunks.map((item) => ({
            score: item.score,
            chunkIndex: item.chunk.chunkIndex,
            pageNumber: item.chunk.pageNumber,
            material: item.chunk.material
        }))
    );

    return topChunks;
};

module.exports = {
    retrieveRelevantChunks
};