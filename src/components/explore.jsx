import React, { useEffect, useState } from "react";
import SubjectCards from "./cards/subjectCards";
import SideBar from "./Sidebar";
import axios from "axios";

import { GoHomeFill } from "react-icons/go";

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from "react-router-dom";

const Explore = () => {
  const [array, setarray] = useState([]);
  const [first, setfirst] = useState(0);

  useEffect(() => {
    const firstapp = async () => {
      const response = await axios.get("http://localhost:3000/explore", {
        withCredentials: true,
      });
      for (let index = 0; index < response.data.length; index++) {
        array.push(response.data[index].name);
        setfirst(1);
      }
    };
    firstapp();
  }, [array]);

  return (
    <>
      <div className="container">
        <SideBar />
      </div>
      <div role="presentation" className="home-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="breadLink" underline="hover" to={"/"} >
          <GoHomeFill />
          </Link>
          <Typography className="breadMain">Explore</Typography>
        </Breadcrumbs>
      </div>
      <div className="home-container">
        <h2>Explore subjects</h2>
        <div className="card-container d-flex">
          {array.map((text, index) => (
            <SubjectCards key={text} subject={text} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
