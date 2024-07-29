import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import Cookies from "js-cookie";

import { User } from "../models/user.js";
import { Subject } from "../models/subject.js";
import { SubTopic } from "../models/subtopic.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { useRouteLoaderData } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(process.env.GEMINI_API_KEY);
let connection = await mongoose.connect(process.env.MONGO_URL);

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow co  okies to be sent
  optionsSuccessStatus: 204,
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "krunal1234",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 86400000, secure: false },
  })
);

app.post("/login", async (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;

  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });

  if (!user) {
    return res.status(400).json({ message: "Email not registered" });
    console.log("failed");
  } else if (user.password != password) {
    return res.status(400).json({ message: "wrong password" });
    console.log("failed");
  } else if (user.password == password) {
    req.session.userData = user;
    Cookies.set("userCookie", "user", { expires: 29 });
    return res.status(200).json({ user });
  }
});

app.get("/auth/check-session", (req, res) => {
  if (req.session.userData) {
    res.status(200).json({ user: req.session.userData });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function () {});
  res.status(200).json("success");
});

app.post("/signup", (req, res) => {
  const user = {
    name: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword,
    age: req.body.userAge,
    education: req.body.userEducation,
    board: req.body.userBoard,
  };
  try {
    const UserData = new User(user);
    UserData.save();
    res.status(200).json({ message: "successfully data entered" });
  } catch (err) {
    res.status(400).json({ message: "error" });
    console.log(err);
  }
});

app.post("/chatbot", (req, res) => {
  const prompt = req.body.input;
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      'you are a teacher and a student is asking you question related to study only answer if the uestion is related to study otherwise say "I cant answer that" and if you answer only in paragraph and shortest form possible no * included Ouestion : ' +
        prompt
    );
    console.log(result1.response.text());
    res.send(result1.response.text());
  }
  run();
});

app.get("/explore", async (req, res) => {
  const subject = await Subject.find({}).catch((err) => {
    console.log(err);
  });
  res.send(subject);
});

app.post("/opted", async (req, res) => {
  console.log("req came");
  console.log(req.body.user);
  const subTopic = await User.find({ email: req.body.user }, "subtopic").catch(
    (err) => {
      console.log(err);
    }
  );
  res.send(subTopic);
});

app.post("/setoption", async (req, res) => {
  const user = req.body.user;
  let topics = [];
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      `give an array of around 10-12 topics related to ${req.body.option} in subject ${req.body.subject}. the response should be array. no other text should be in the response.response should be without any "\n" or any text. ex : ["example topic"]  `
    );
    const inputString = result1.response.text();
    const startIndex = inputString.indexOf("[");
    const endIndex = inputString.indexOf("]");
    const result = inputString.substring(startIndex, endIndex + 1);
    topics = JSON.parse(result);
    console.log(topics);
    try {
      const response = await User.updateOne(
        { email: user },
        {
          $push: {
            subtopic: {
              name: req.body.option,
              subject: req.body.subject,
              level: "beginner",
              smallTopics: topics,
            },
          },
        },
        { new: true }
      );
      console.log(response);
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  run();
});
app.get("/Maths", async (req, res) => {
  const response = await SubTopic.find({ subject: "Maths" });
  res.send(response);
});
app.get("/Science", async (req, res) => {
  const response = await SubTopic.find({ subject: "Science" });
  res.send(response);
});
app.get("/History", async (req, res) => {
  const response = await SubTopic.find({ subject: "History" });
  res.send(response);
});
app.get("/English", async (req, res) => {
  const response = await SubTopic.find({ subject: "English" });
  res.send(response);
});
app.get("/Hindi", async (req, res) => {
  const response = await SubTopic.find({ subject: "Hindi" });
  res.send(response);
});
app.get("/Gujarati", async (req, res) => {
  const response = await SubTopic.find({ subject: "Gujarati" });
  res.send(response);
});

app.post("/yt", async (req, res) => {
  const apiKey = process.env.YT_API_KEY; // Replace with your API key
  const query = `teaching ${req.body.opt}`; // Search query
  const maxResults = 5; // Number of results to return

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${maxResults}&key=${apiKey}`;
  const linkArray = [];
  const run = async () => {
    console.log("run enabled");
    try {
      const response = await axios.get(url, { withCredentials: true });
      const videos = response.data.items;
      videos.forEach((video) => {
        if (video.id.videoId) {
          linkArray.push(`https://www.youtube.com/watch?v=${video.id.videoId}`);
        }
      });
      res.send(linkArray);
    } catch (error) {
      console.log(error);
    }
  };
  run();
});

app.post("/course", (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;
  const smallTopic = req.body.smallTopic;
  console.log(topic);
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      "teach me in detail with every necessary topic and with example and practice questions regarding the teached topic " +
        smallTopic +
        " " +
        level +
        " level.  in response replace ** with h1 tag give every h1 tag classname `dangH1`give classname like react className and replace evey * with p tag. response must not contain any '*' or '**' characters. each content should be in html div tag nothing should be outside html div tag remove ```html and ``` from the response."
    );
    res.send(result1.response.text());
  }
  run();
});

app.post("/getTopic", async (req, res) => {
  const topic = req.body.topic;
  const subject = req.body.subject;
  const email = req.body.user;
  let topics = [];
  console.log({ topic, subject, email });
  const userData = await User.find({
    email: email,
    subtopic: {
      $elemMatch: { name: topic, subject: subject },
    },
  });
  if (userData[0]) {
    for (let index = 0; index < userData[0].subtopic.length; index++) {
      if (
        userData[0].subtopic[index].name == topic &&
        userData[0].subtopic[index].subject == subject
      ) {
        topics = userData[0].subtopic[index].smallTopics;
      }
    }
  }
  console.log(topics);
  res.send(topics);
});

app.post("/exam", (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      `create an mcq test on topic ${topic}. The test should be of 10 questions. the level of exam should be ${level} level. and the response must follow the structure given here and no other text of character should be there in response other that array itself. [{question:"question of mcq",options:[option1,option2,option3,option4],correctAnswer:"correact answer"}]  ` +
        "dont add the ```json and ``` in the response"
    );
    res.send(result1.response.text());
  }
  run();
});

app.post("/submitExam", async (req, res) => {
  console.log("submit exam req came");
  const examData = {
    user: req.body.user,
    subject: req.body.subject,
    topic: req.body.topic,
    level: req.body.level,
    test: req.body.test,
    userAnswers: req.body.userAnswers,
    score: req.body.score,
  };
  if (examData.level == "beginner" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "intermidiate";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  } else if (examData.level == "intermidiate" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "pro";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  } else if (examData.level == "pro" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "complete";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  }

  console.log(examData.userAnswers);
  console.log(examData.test.options);
  try {
    const response = await User.updateOne(
      { email: examData.user },
      {
        $push: {
          exam: {
            subject: examData.subject,
            topic: examData.topic,
            level: examData.level,
            test: examData.test,
            score: examData.score,
            userAnswers: examData.userAnswers,
          },
        },
      },
      { new: true }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }

  if (examData.score < 8) {
    async function run() {
      // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({ history: [] });
      const result1 = await chat.sendMessage(
        `you are a exam evaluater this is the exam data from user subject: ${examData.subject}, topic: ${examData.topic}, testData: ${examData.test}, users answers in order of questions; ${examData.userAnswers}, score: ${examData.score}  if user scores low marks then return a array of suggested topic user lacs in. in response only provide the array of suggested topic nothing else and if user scores good then return null array.`
      );
      const sugTopic = result1.response.text();
      console.log(sugTopic);
    }
    run();
  }
});

app.post("/getExamData", async (req, res) => {
  try {
    const data = await User.findOne({
      email: req.body.user,
    });
    console.log(data.exam);
    res.send(data.exam);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log(`server running on port 3000`);
});
