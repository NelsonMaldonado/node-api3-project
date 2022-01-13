const express = require('express');
const User = require('./users-model')
const Post = require('../posts/posts-model')
const {
  handleError,
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware')

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get(req.query)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
});

router.put('/:id', validateUser, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  User.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  }
  catch (err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  User.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(next)
});

router.post(
  '/:id/posts', 
  validateUserId, 
  validatePost, 
  async (req, res, next) => {
  try {
    const post = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(post)
  }
  catch (err){
    next(err)
  }
});

router.use(handleError)
// do not forget to export the router
module.exports = router