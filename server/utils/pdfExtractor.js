const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");
const { promisify } = require("util");

const pdfParse = require("pdf-parse");

const execFileAsync = promisify(execFile);


const extractTextFromPDF = async (filePath) => {

    const fileBuffer = fs.readFileSync(filePath);

    // --------------------------------------------------
    // STEP 1: Try normal PDF text extraction
    // --------------------------------------------------

    const pdfData = await pdfParse(fileBuffer);

    const normalText = pdfData.text?.trim();

    if (normalText) {

        console.log("Text extracted using pdf-parse");

        return [
            {
                pageNumber: null,
                text: normalText
            }
        ];
    }


    // --------------------------------------------------
    // STEP 2: If no text exists, use OCR
    // --------------------------------------------------

    console.log("No usable text found.");
    console.log("Starting OCR...");


    const tempDirectory = fs.mkdtempSync(
        path.join(os.tmpdir(), "ai-study-")
    );

    const imageDirectory = path.join(
        tempDirectory,
        "images"
    );

    fs.mkdirSync(imageDirectory);


    try {

        // --------------------------------------------------
        // Convert PDF pages into high-resolution PNG images
        // --------------------------------------------------

        console.log("Converting PDF pages to images...");

        await execFileAsync(
            "pdftoppm",
            [
                "-png",
                "-r",
                "300",
                filePath,
                path.join(imageDirectory, "page")
            ]
        );


        const imageFiles =
            fs.readdirSync(imageDirectory)
                .filter(file => file.endsWith(".png"))
                .sort();


        console.log(
            `Created ${imageFiles.length} page images`
        );


        const pages = [];


        // --------------------------------------------------
        // OCR each page
        // --------------------------------------------------

        for (let i = 0; i < imageFiles.length; i++) {

            const imageFile = imageFiles[i];

            const imagePath =
                path.join(
                    imageDirectory,
                    imageFile
                );


            console.log(
                `Running OCR on page ${i + 1}...`
            );


            const { stdout } =
                await execFileAsync(
                    "tesseract",
                    [
                        imagePath,
                        "stdout",

                        // Better layout detection
                        "--psm",
                        "6",

                        // English language
                        "-l",
                        "eng"
                    ]
                );


            const pageText =
                stdout
                    .replace(/\r/g, "")
                    .trim();


            if (pageText) {

                console.log(
                    `Page ${i + 1}: ${pageText.length} characters`
                );


                pages.push({
                    pageNumber: i + 1,
                    text: pageText
                });

            } else {

                console.log(
                    `Page ${i + 1}: no readable text`
                );

            }
        }


        // --------------------------------------------------
        // Validate OCR result
        // --------------------------------------------------

        if (pages.length === 0) {

            throw new Error(
                "OCR could not extract any readable text"
            );
        }


        console.log(
            `OCR successfully extracted ${pages.length} pages`
        );


        return pages;


    } finally {

        // --------------------------------------------------
        // Remove temporary OCR files
        // --------------------------------------------------

        fs.rmSync(
            tempDirectory,
            {
                recursive: true,
                force: true
            }
        );
    }
};


module.exports = extractTextFromPDF;