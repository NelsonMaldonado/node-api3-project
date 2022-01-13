const express = require("express")
const User = require("./users-model")
const Post = require("../posts/posts-model")
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware")
const res = require("express/lib/response")
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router()

router.get("/", (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get(req.query)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch(next)
})

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  res.status(200).json(req.user)
  // this needs a middleware to verify user id
})

router.post("/", (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
    .then((user) => {
      res.status(201).json(user)
    })
    .catch(next)
})

router.put("/:id", validateUser, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  User.update(req.params.id, req.body)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
})

router.delete("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
})

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  User.getUserPosts(req.params.id)
    .then((post) => {
      res.status(200).json(post)
    })
    .catch(next)
  // this needs a middleware to verify user id
})

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const post = await Post.insert({
        user_id: req.params.id,
        text: req.text,
      })
      res.status(201).json(post)
    } catch (err) {
      next(err)
    }
  }
)

// do not forget to export the router
module.exports = router