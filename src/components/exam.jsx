import React, { useState, useEffect, useContext } from "react";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { courseContext } from "../context/courseContext";
import { AuthContext } from "../context/authcontext";
import axios from "axios";

const MCQTest = (props) => {
  const { user } = useContext(AuthContext);
  const { opt, setopt } = useContext(courseContext);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers([
      ...answers,
      [questionIndex]= option,
    ]);
  };

  const handleSubmit = async () => {
    let newScore = 0;
    props.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        newScore += 1;
      }
    });

    setScore(newScore);
    setSubmitted(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/submitExam",
        {
          user: user.email,
          subject: opt.subject,
          topic: opt.course,
          level: opt.level,
          test: props.questions,
          userAnswers: answers,
          score: newScore,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
    // Optionally, store the score in local storage or send to a server
    localStorage.setItem("mcqTestScore", newScore);
  };
  // questions.js

  return (
    <div className="exam-container">
      <h1>MCQ Test</h1>
      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {props.questions.map((question, index) => (
            <div className="question-div" key={index}>
              <div className="question">
                <h2>{question.question}</h2>
              </div>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={<Radio />}
                    label={option}
                    id={`${index}-${option}`}
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
          <button className="btn btn-dark" type="submit">
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h2>
            Your Score: {score} / {props.questions.length}
          </h2>
          {score == props.questions.length ? (
            <h6>Excellent</h6>
          ) : score > props.questions.length / 2 ? (
            <h6>good efforts</h6>
          ) : (
            <h6>Need more practice</h6>
          )}
        </div>
      )}
    </div>
  );
};

export default MCQTest;
