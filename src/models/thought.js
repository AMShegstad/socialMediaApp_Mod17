import { Schema, model } from 'mongoose';

const thoughtSchema = new Schema(
    /*
        thoughtText = string, required, between 1 and 280 characters.
        createdAt = date, default value is the current timestamp.
        reactions = array of _id values referencing the Reaction model.
        username = string, required.
    */
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        reactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Reaction',
            },
        ],
        username: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    },
);

const Thought = model('Thought', thoughtSchema);

export default Thought;