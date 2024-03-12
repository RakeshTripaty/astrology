const mongoose = require("mongoose");

const KundliSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  time_of_birth: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
});

const KundaliMatchSchema = new mongoose.Schema({
  boy_id: {
    type: String,
    required: true,
  },
  girl_id: {
    type: String,
    required: true,
  },
  match_score: {
    type: Number,
    required: true,
  },
});

const BoyKundli = mongoose.model("BoyKundli", KundliSchema);
const GirlKundli = mongoose.model("GirlKundli", KundliSchema);
const KundaliMatch = mongoose.model("KundaliMatch", KundaliMatchSchema);

module.exports = {
  BoyKundli,
  GirlKundli,
  KundaliMatch,
};
