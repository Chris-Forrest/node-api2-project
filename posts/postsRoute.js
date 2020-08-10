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
});

router.get("/api/posts/:id", (req, res) => {

    db.findById(req.params.id)
        .then(post => {
            if (post !== undefined && post.length > 0) res.status(200).json(post)
            else res.status(404).json({message: "The post with the specified ID does not exist."})
        })
        .catch(err => {
            console.log(err.stack);
            res.status(500).json({ message: "The post information could not be retrieved."})
        })
});  

router.get("/api/posts/:id/comments", (req,res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The comments information could not be retrieved."});
        })
});

/*************Post calls  ***********************************************************************************************************/
/*
router.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({ message: "Please provide title and contents for the post."});
    }
    db.insert(req.body)
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "There was an error while saving the post to the database"});
        })
});*/

router.post("/api/posts", async (req, res) => {
    try {
      const { title, contents } = req.body;
  
      if(!title || !contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      }
  
      const post = await db.insert({ title, contents });
  
      res.status(201).json({ ...post, title, contents });
    } catch (err) {
      res.status(500).json({ message: "There was an error while saving the post to the database" });
    }
  });
/*
router.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const post = db.findById(req.params.id);
    if(post === undefined || post.length <= 0) return res.status(404).json(
        {message: "The post with the specified ID does not exist."
    });
    else if (!req.body.text) return res.status(400).json({
        errorMessage: "Please provide text for the comment."
    });
    db.insertComment({
        text: req.body.text,
        post_id: req.params.id,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    }).then(comment => res.status(201).json(comment))
        .catch(err => {
            console.log(err.stack);
            res.status(500).json({ message: "There was an error while saving the comment to the database"});
        })
}); */

router.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const post = await db.findById(id)
  
      if (!post.length) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
  
      if(!text) {
        return res.status(400).json({ message: "Please provide text for the comment." });
      }
  
      const commentId = await db.insertComment({ post_id: id, text });
      const comment = await db.findCommentById(commentId.id);
  
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ message: "There was an error while saving the comment to the database" });
    }
  });

/************************Delete request  *********************************************************************************************/
router.delete("/api/posts/:id", (req, res) => {
    db.remove(req.params.id)
        .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }

            res.status(200).json({
                message: "post deleted!",
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "The post could not be removed."
            })
        })
});

/************************************ Edit post request  **********************************************************/
router.put("/api/posts/:id", (req, res) => {
    
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({ message: "Please provide title and contents for the post."})
    }
    
    db.update(req.params.id, req.body)
        .then((post) => {
            if (!post) {
                return res.status(404).json({ message: "post not found!"})
            }
            res.status(200).json({ message: "Post was edited successfully!"})
        })
        .catch((error) => {
            res.status(500).json({ message:"There was an error while saving the post to the database."})
        })
});
/*************************module for export of router  **************************************************************************/
module.exports = router;