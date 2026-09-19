const chunkText = (text, chunkSize = 1000, overlap = 200) => {

    // If there is no text, return an empty array
    if (!text || !text.trim()) {
        return [];
    }

    // Overlap must be smaller than chunk size
    if (overlap >= chunkSize) {
        throw new Error("Overlap must be smaller than chunk size");
    }

    // Clean unnecessary whitespace
    const cleanText = text
        .replace(/\s+/g, " ")
        .trim();

    const chunks = [];

    let start = 0;

    while (start < cleanText.length) {

        let end = Math.min(
            start + chunkSize,
            cleanText.length
        );

        // Try to end the chunk at a word boundary
        if (end < cleanText.length) {

            const lastSpace = cleanText.lastIndexOf(
                " ",
                end
            );

            if (lastSpace > start) {
                end = lastSpace;
            }
        }

        const chunk = cleanText
            .slice(start, end)
            .trim();

        if (chunk) {
            chunks.push(chunk);
        }

        // Stop when we reach the end
        if (end >= cleanText.length) {
            break;
        }

        // Move forward while keeping some overlap
        start = end - overlap;
    }

    return chunks;
};

module.exports = chunkText;