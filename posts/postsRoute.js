const express = require("express");
const db = require('../data/db');
const router = express.Router();


router.get("/", (req,res) => {
    res.json({ message: "Welcome to the second node project"})
});

router.get("/api", (req,res) => {
    res.json({ message: "welcome to the api for the second node project"})
});

router.get("/api/posts", async (req,res) => {
    try{
        const posts = await db.find();
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({ message: " The posts could not be retrieved."})
    }
})

router.get("api/posts/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
    .then(post => {
        if(id) {
            res.status(200).json(post)
        }else{
            res.status(404).json({ message: "Post with specified ID not found"})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Error retrieving post."})
    })
});

module.exports = router;