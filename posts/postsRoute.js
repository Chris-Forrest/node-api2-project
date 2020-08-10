const express = require("express");
const db = require('../data/db');
const router = express.Router();

/********************initial post calls  **************************************************************************************/
router.get("/", (req,res) => {
    res.json({ message: "Welcome to the second node project"})
});

router.get("/api", (req,res) => {
    res.json({ message: "welcome to the api for the second node project"})
});

/************************************** get calls  ********************************************************************************/
router.get("/api/posts", (req,res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The posts could not be retrieved"})
        })
})

router.get("/api/posts/:id", (req, res) => {

    db.findById(req.params.id)
        .then(post => {
            if (post !== undefined && post.length > 0) res.status(200).json(post);
            else res.status(404).json({message: "The post with the specified ID does not exist."});
        })
        .catch(err => {
            console.log(err.stack);
            res.status(500).json({error: "The post information could not be retrieved."});
        });
});  

router.get("/api/posts/:id/comments", (req,res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "The comments information could not be retrieved."});
        })
})

/*************Post calls  ***********************************************************************************************************/

module.exports = router;