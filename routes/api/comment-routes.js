const router = require('express').Router();

// set the comment-controller methods as callback functions
const { addComment, removeComment } = require('../../controllers/comment-controller');

// add comment api route `/api/comments/pizzaId`
router.route('/:pizzaId').post(addComment);  // addComment method used here as callback function

// delete comment api route `/api/comments/pizzaId/commentId (need both parameters to identify particular pizza the comment belongs to)
router.route("/:pizzaId/:commentId").delete(removeComment)  // removeComment method used here as callback fucntion


module.exports = router;