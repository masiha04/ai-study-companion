const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const Mastery =
    require("../models/Mastery");

const router = express.Router();


router.get(
    "/:projectId",
    authMiddleware,
    async (req, res) => {

        try {

            const mastery =
                await Mastery.find({

                    project:
                        req.params.projectId,

                    user:
                        req.userId

                }).sort({
                    score: 1
                });


            const average =
                mastery.length
                    ? Math.round(
                        mastery.reduce(
                            (sum, item) =>
                                sum + item.score,
                            0
                        ) /
                        mastery.length
                    )
                    : 0;


            return res.status(200).json({

                averageMastery:
                    average,

                concepts:
                    mastery

            });

        } catch (error) {

            return res.status(500).json({
                message:
                    "Could not fetch mastery"
            });

        }

    }
);


module.exports = router;