const router = require('express').Router();

// set the comment-controller methods as callback functions
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');


// post route to add comment using this endpoint:   /api/comments/pizzaId  (comment belongs to pizza by Id)
router.route('/:pizzaId').post(addComment);  // addComment method used here as callback function


// delete & put routes for parent comment using this endpoint:   /api/comments/pizzaId/commentId  (commentId belongs to single pizzaId)
router.route('/:pizzaId/:commentId')
.put(addReply)  // here we use the PUT route to update a comment by adding a reply
.delete(removeComment)  // removeComment method used here as callback function


// delete route for reply by replyId  (replyId that belongs to this commentId that belongs to single pizzaId)
router.route('/:pizzaId/:commentId/replyId').delete(removeReply);   

module.exports = router;