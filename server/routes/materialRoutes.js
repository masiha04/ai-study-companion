const express = require("express");
const multer = require("multer");
const path = require("path");

const Material = require("../models/Material");
const Project = require("../models/Project");
const Chunk = require("../models/Chunk");

const authMiddleware = require("../middleware/authMiddleware");

const extractTextFromPDF = require("../utils/pdfExtractor");
const chunkText = require("../utils/chunker");

const {
    generateEmbedding
} = require("../services/embeddingService");

const router = express.Router();

// ===============================
// MULTER CONFIGURATION
// ===============================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});

// ===============================
// BACKGROUND PDF PROCESSING
// ===============================

const processMaterial = async (
    material,
    filePath,
    projectId,
    userId
) => {
    try {
        console.log(
            `Starting background processing for material ${material._id}`
        );

        // Mark as processing
        material.status = "processing";
        await material.save();

        // ===============================
        // EXTRACT PDF TEXT
        // ===============================

        const pages = await extractTextFromPDF(filePath);

        const extractedText = pages
            .map(page => page.text)
            .join("\n\n");

        material.extractedText = extractedText;
        await material.save();

        // ===============================
        // CREATE PAGE-AWARE CHUNKS
        // ===============================

        let allChunks = [];
        let globalChunkIndex = 0;

        for (const page of pages) {
            const pageChunks = chunkText(page.text);

            const pageChunkDocuments =
                pageChunks.map(text => ({
                    text,

                    chunkIndex:
                        globalChunkIndex++,

                    pageNumber:
                        page.pageNumber,

                    material:
                        material._id,

                    project:
                        projectId,

                    user:
                        userId
                }));

            allChunks =
                allChunks.concat(
                    pageChunkDocuments
                );
        }

        console.log(
            `Created ${allChunks.length} page-aware chunks`
        );

        // ===============================
        // GENERATE EMBEDDINGS
        // ===============================

        if (allChunks.length > 0) {
            console.log(
                `Generating embeddings for ${allChunks.length} chunks...`
            );

            for (const chunk of allChunks) {
                chunk.embedding =
                    await generateEmbedding(
                        chunk.text
                    );
            }

            await Chunk.insertMany(
                allChunks
            );

            console.log(
                "Chunk embeddings generated successfully"
            );
        }

        // ===============================
        // MARK MATERIAL READY
        // ===============================

        material.status = "ready";
        await material.save();

        console.log(
            `Material ${material._id} processed successfully`
        );

    } catch (error) {
        console.error(
            "Background PDF processing error:",
            error.message
        );

        material.status = "failed";
        await material.save();
    }
};

// ===============================
// UPLOAD MATERIAL
// ===============================

router.post(
    "/:projectId",
    authMiddleware,
    upload.single("file"),

    async (req, res) => {
        try {
            const { projectId } = req.params;

            // ===============================
            // CHECK PDF EXISTS
            // ===============================

            if (!req.file) {
                return res.status(400).json({
                    message:
                        "PDF file is required"
                });
            }

            // ===============================
            // CHECK FILE TYPE
            // ===============================

            if (
                req.file.mimetype !==
                "application/pdf"
            ) {
                return res.status(400).json({
                    message:
                        "Only PDF files are allowed"
                });
            }

            // ===============================
            // CHECK PROJECT OWNERSHIP
            // ===============================

            const project =
                await Project.findOne({
                    _id: projectId,
                    user: req.userId
                });

            if (!project) {
                return res.status(404).json({
                    message:
                        "Project not found"
                });
            }

            // ===============================
            // CREATE MATERIAL
            // ===============================

            const material =
                await Material.create({
                    name:
                        path.parse(
                            req.file.originalname
                        ).name,

                    originalName:
                        req.file.originalname,

                    filePath:
                        req.file.path,

                    fileType:
                        req.file.mimetype,

                    status:
                        "queued",

                    project:
                        projectId,

                    user:
                        req.userId
                });

            // ===============================
            // START BACKGROUND PROCESSING
            // ===============================

            processMaterial(
                material,
                req.file.path,
                projectId,
                req.userId
            );

            // ===============================
            // RETURN IMMEDIATELY
            // ===============================

            return res.status(201).json({
                message:
                    "PDF uploaded successfully. Processing started.",

                material
            });

        } catch (error) {
            console.error(
                "Material upload error:",
                error.message
            );

            return res.status(500).json({
                message:
                    "Something went wrong while uploading material"
            });
        }
    }
);

// ===============================
// GET PROJECT MATERIALS
// ===============================

router.get(
    "/:projectId",
    authMiddleware,

    async (req, res) => {
        try {
            const { projectId } = req.params;

            // ===============================
            // CHECK PROJECT OWNERSHIP
            // ===============================

            const project =
                await Project.findOne({
                    _id: projectId,
                    user: req.userId
                });

            if (!project) {
                return res.status(404).json({
                    message:
                        "Project not found"
                });
            }

            // ===============================
            // FETCH MATERIALS
            // ===============================

            const materials =
                await Material.find({
                    project: projectId,
                    user: req.userId
                }).sort({
                    createdAt: -1
                });

            return res.status(200).json({
                materials
            });

        } catch (error) {
            console.error(
                "Get materials error:",
                error.message
            );

            return res.status(500).json({
                message:
                    "Something went wrong while fetching materials"
            });
        }
    }
);

module.exports = router;