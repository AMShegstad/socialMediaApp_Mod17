import { Schema, model, Types } from "mongoose";

const reactionSchema = new Schema(
  /*
    reactionId = use Mongoose's ObjectId data type. Default value is set to a new ObjectId.

    reactionBody = String, Required, 280 Character Maximum

    username = String, Required

    createdAt = Date, Set default value to the current timestamp, Use a getter method to the format thetimestamp on query.
    */
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
  }
);

const Reaction = model("Reaction", reactionSchema);

export default Reaction;
