import React, { useContext, useState, useEffect } from "react";
import ExamChart from "./testData";
import SideBar from "./Sidebar";

import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { PieChart } from "@mui/x-charts/PieChart";

const Analysis = () => {
  const { user } = useContext(AuthContext);
  const [first, setfirst] = useState(0);
  const [data, setdata] = useState([{ id: 0, value: 9, label: "maths" }]);
  const getExamAnalysis = async () => {
    const response = await axios.post(
      "http://localhost:3000/getExamAnalysis",
      {
        user: user.email,
      },
      {
        withCredentials: true,
      }
    );

    for (let index = 0; index < response.data.length; index++) {
      data.push({
        id: index,
        value: response.data[index].score,
        label: response.data[index].smallTopic,
      });
    }
    setfirst(1);
    console.log(data);
  };
  useEffect(() => {
    getExamAnalysis();
  }, [first]);

  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <SideBar />
        </div>
      </div>
      <div className="home-container">
        {/* <h1>{user.subtopic[1].sugTopic}</h1> */}
        <PieChart
          series={[
            {
              data: data,
            },
          ]}
          width={550}
          height={200}
        />
      </div>
    </>
  );
};

export default Analysis;
