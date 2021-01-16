import mongoose, {Schema, Document} from 'mongoose';

const refreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface IRefreshToken extends Document {
  refreshToken : String,
  date : Date
}

module.exports = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);