const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/loveaajkal");

const reportSchema = new mongoose.Schema({
  reporter: {
    type: String,
  },

  reportermail: {
    type: String,
  },

  email: {
    type: String,
  },
  issue: {
    type: String,
  },
});

module.exports = mongoose.model("report", reportSchema);
