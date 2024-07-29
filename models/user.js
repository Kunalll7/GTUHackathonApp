import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  board: Boolean,
  education: String,
  subtopic: [
    {
      name: String,
      subject: String,
      level: String,
      smallTopics:[String]
    },
  ],
  exam: [
    {
      subject: String,
      topic: String,
      level: String,
      userAnswers:[String],
      test: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
        },
      ],
      score:Number
    },
  ],
});

export const User = mongoose.model("user", userSchema);
