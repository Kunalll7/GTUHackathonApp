import React, { useContext, useState, useEffect } from "react";
import ExamChart from "./testData";
import SideBar from "./Sidebar";

import axios from "axios";
import { AuthContext } from "../context/authcontext";

const Analysis = () => {
  
  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <SideBar />
        </div>
      </div>
      <div className="home-container">

      </div>
    </>
  );
};

export default Analysis;
