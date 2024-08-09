import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { courseContext } from "../context/courseContext";
import { AuthContext } from "../context/authcontext";
import { topicContext } from "../context/topicContext";
import Loading from "./loading";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import SideBar from "./Sidebar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const Topic = () => {
  let navigate = useNavigate();
  const { topicSub, settopicSub } = useContext(topicContext);
  const [arrayTopic, setarrayTopic] = useState([]);
  const [sugarrayTopic, setsugarrayTopic] = useState([]);
  const { opt, setopt } = useContext(courseContext);
  const [isloading, setisloading] = useState(true);
  const { user } = useContext(AuthContext);

  const steps = [
    "Select master blaster campaign settings",
    "Create an ad group",
    "Create an ad",
  ];
  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getTopic",
        { topic: opt.course, subject: opt.subject, user: user.email },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        if (!arrayTopic.includes(response.data[index])) {
          arrayTopic.push(response.data[index]);
        }
      }
      console.log(arrayTopic);
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getsugData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getsugTopic",
        { topic: opt.course, subject: opt.subject, user: user.email },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        if (!sugarrayTopic.includes(response.data[index])) {
          sugarrayTopic.push(response.data[index]);
        }
      }
      console.log(sugarrayTopic);
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    getsugData();
  }, []);

  const handelSubmit = (value) => {
    settopicSub(value);
    navigate("/opted/topic/course");
  };

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
          <Link
            className="breadLink breadMain"
            underline="hover"
            to={"/opted/topic"}
          >
            {opt.course}
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
        <div className="home-container">
          {/* <h1 className="listTitle">
              Explore and select topics tailored to your subjects
            </h1> */}
          <div className="listDiv">
            <List className="listContainer">
              {arrayTopic.map((text, index) => (
                <ListItem className="listItem" key={text} disablePadding>
                  <ListItemButton onClick={() => handelSubmit(text)}>
                    <ListItemText primary={text} />
                    <CheckCircleIcon/>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      )}
    </>
  );
};

export default Topic;
