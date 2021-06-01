const mongoose = require("mongoose");

const VisitsShema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  guest_count: {
    type: Number,
    required: true,
  },
  visit_sum: {
    type: Number,
    required: true,
  },
  guest_id: {
    type: String,
  },
});

module.exports = mongoose.model("Visits", VisitsShema);
