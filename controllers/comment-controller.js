// import models needed
const { Comment, Pizza } = require('../models');

const commentController = {
    // Instead of passing `req` as parameter, we destructure it to get what we want only. in this case `params` & `body`instead of the whole req body
    // Add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                //console.log(_id)
                return Pizza.findByIdAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } }, // the $push method adds the comment's id to the specific pizza we want to update
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.staus(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } }, // $pull method removes the comment's id, returning a new version of the updated document
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;