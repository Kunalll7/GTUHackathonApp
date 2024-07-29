import React, { useContext, useEffect, useState } from "react";
import SideBar from "./Sidebar";
import { courseContext } from "../context/courseContext";
import axios from "axios";
import MCQTest from "./exam";
import { AuthContext } from "../context/authcontext";
import { topicContext } from "../context/topicContext";

import { GoHomeFill } from "react-icons/go";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import SubCard from "./cards/subCard";
import Loading from "./loading";
import Chip from "@mui/material/Chip";
import { GoPencil } from "react-icons/go";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Topic from "./Topic";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Chatbot from "./chatbot";

const Course = () => {
  const [giveExam, setgiveExam] = useState(false);
  const { opt, setopt } = useContext(courseContext);
  const { topicSub, settopicSub } = useContext(topicContext);
  const [content, setcontent] = useState("");
  const [isloading, setisloading] = useState(true);
  const [links, setlinks] = useState([]);
  const [questions, setquestions] = useState([]);
  const [chatBotOpen, setchatBotOpen] = useState(false);
  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/course",
        {
          topic: opt.course,
          level: opt.level,
          smallTopic: topicSub,
        },
        {
          withCredentials: true,
        }
      );
      setcontent(response.data);
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLinks = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/yt",
        { opt: opt.course },
        { withCredentials: true }
      );

      for (let index = 0; index < response.data.length; index++) {
        links.push(response.data[index]);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(links);
  };
  const getExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/exam",
        { topic: opt.course, level: opt.level },
        { withCredentials: true }
      );
      setquestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const loadExam = () => {
    setgiveExam(true);
  };
  const handelFab = () =>{
    setchatBotOpen(!chatBotOpen);
  }

  useEffect(() => {
    getData();
    getLinks();
    getExam();
  }, []);

  return (
    <>
      <div className="container">
        <SideBar />
      </div>
      <div className="home-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="breadLink " underline="hover" to={"/"}>
            <GoHomeFill className="goHome" />
          </Link>
          <Link className="breadLink " underline="hover" to={"/opted"}>
            Enrolled
          </Link>
          <Link className="breadLink " underline="hover" to={"/opted/topic"}>
            {opt.course}
          </Link>
          <Link
            className="breadLink breadMain"
            underline="hover"
            to={"/opted/topic/course"}
          >
            {topicSub}
          </Link>
        </Breadcrumbs>
      </div>
      {isloading ? (
        <div className="home-container">
          <Loading />
          <br />
          <Skeleton variant="rounded" width={1250} height={800} />
        </div>
      ) : (
        <>
          <div className="home-container">
            <Fab onClick={handelFab} className="chatBotBtn" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
            {chatBotOpen ? <Chatbot /> : ""}
            <div>
              <Chip label={opt.level} className={"card-chip " + opt.level} />
            </div>
            <br />
            <div
              className="dangDiv"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* <div>
              {links.map((text, index) => (
                <a target="_blank" className="" href={text}>Resources</a>
              ))}
            </div> */}
          </div>
          <div className="home-container">
            {giveExam ? (
              <MCQTest questions={questions} />
            ) : (
              <div className="give-exam">
                <h2>Show What You've Learned!</h2>{" "}
                <Button
                  onClick={loadExam}
                  className="examBtn"
                  variant="contained"
                  disableElevation
                  endIcon={<GoPencil />}
                >
                  Start Test
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Course;
