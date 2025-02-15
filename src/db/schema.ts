import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  messages: [String],
  responses: [String],
  onboarding: Boolean,
});

const User = model('User', userSchema);
export default User;
