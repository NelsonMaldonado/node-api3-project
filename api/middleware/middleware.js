const User = require('../users/users-model')

function handleError(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  })
}

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  )
  next()
}

function validateUserId(req, res, next) {
  User.getById(req.params.id)
    .then(possibleUser => {
      if (possibleUser) {
        req.user = possibleUser
        next()
      } else {
        res.status(404).json({message: 'user not found'})
      }
    })
    .catch(next)
}

function validateUser(req, res, next) {
  const {name} = req.body
  if (!name){
    next({status: 400, message: 'missing required name field'})
  }
  else {
    next()
  }

}

function validatePost(req, res, next) {
  const {text} = req.body
  if (!text || !text.trim()) {
    res.status(400).json({
      message: "missing required text field"
    })
  }
  else {
    req.text = text.trim()
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  handleError,
  logger,
  validateUserId,
  validateUser,
  validatePost
}