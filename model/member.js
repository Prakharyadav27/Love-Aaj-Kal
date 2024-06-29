const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/loveaajkal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: String,
  dob: {
    type: Date,
    default: Date.now,
  },
  consent: {
    type: Boolean,
    default: false,
  },
  preference: {
    type: String,
    default: "both",
  },
  photo: {
    type: String,
    default:
      "https://i.pinimg.com/564x/57/00/c0/5700c04197ee9a4372a35ef16eb78f4e.jpg",
  },
  bio: {
    type: String,
    default: "This is my bio",
  },
  location: {
    type: String,
    default: "India",
  },
  age: {
    type: Number,
    default: 18,
  },
  height: {
    type: Number,
    default: 150,
  },
  education: {
    type: String,
    default: "Graduate",
  },
  job: {
    type: String,
    default: "Software Developer",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
    },
  ],
});

module.exports = mongoose.model("member", memberSchema);
