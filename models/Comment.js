const { Schema, model, Types } = require('mongoose');

// import dateFormat() to format createdAt timestamp
const dateFormat = require('../utils/dateFormat');


const ReplySchema = new Schema({
    // with Types object importet, set custom id for replies to avoid confusion with parent comment _id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type: String
    },
    writtenBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    }
},
    {   // add toJSON field to use getters that were set
        toJSON: {
            getters: true
        }
    }
);


const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    // here we associate the parent comment to its reply children
    replies: [ReplySchema]
},
    {   // add toJSON field to use getters & virtuals that are set
         toJSON: {
             virtuals: true, // these keep count of number of replies for each comment
            getters: true
        },
        id: false
    }
);

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});


// const Reply = model('Reply', ReplySchema);
const Comment = model('Comment', CommentSchema);

module.exports = Comment;