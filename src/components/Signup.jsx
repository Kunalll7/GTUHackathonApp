import React, { useState } from "react";
import "../components/css/signup.css";
import { Navigate, Link, useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [education, setEducation] = useState("");
  const [age, setage] = useState(0);
  const [board, setboard] = useState(false);
  const [next, setnext] = useState(true);

  const handleSignup = (e) => {
    e.preventDefault();
    setnext(false);
  };
  const handleNext = async (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signing up with", { name, email, password });
    let r = await fetch("http://localhost:3000/signup", {
      method: "POST",
      body: JSON.stringify({
        userName: name,
        userAge: age,
        userBoard: board,
        userEducation: education,
        userEmail: email,
        userPassword: password,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    let status = await r.json();
    if (r.status == 200) {
      alert("Signedup successfully, Go to login.");
      navigate("/login");
    } else {
      alert("email alredy registered");
    }
  };
  const toggleForm = () => {
    navigate("/login");
  };
  const handleInputChange = (event) => {
    setEducation(event.target.value);
  };

  return (
    <div className="login-page">
      {next ? (
        <form onSubmit={handleSignup} className={"form"}>
          <h2 className={"header"}>Signup</h2>
          <div className={"formGroup"}>
            <label className={"label"}>Name</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={"input"}
              required
            />
          </div>
          <div className={"formGroup"}>
            <label className={"label"}>Email</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={"input"}
              required
            />
          </div>

          <div className={"formGroup"}>
            <label className={"label"}>Password</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={"input"}
              required
            />
          </div>
          
          <div className="formGroup">
            <button type="submit" className={"button"}>
              Next
            </button>
          </div>
          <div className="formGroup">
            <p onClick={toggleForm} className={"toggle"}>
              Already have an account? Log in here.
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleNext} className={"form"}>
          <h2 className={"header"}>Signup</h2>
          <div className={"formGroup"}>
            <label className={"label"}>Age</label>
            <br />
            <input
              type="number"
              value={age}
              onChange={(e) => setage(e.target.value)}
              className={"input"}
              required
            />
          </div>
          <div className={"formGroup"}>
            <label className={"label"}>Education </label>
            <br />
            <select
              id="cars"
              name="cars"
              value={education}
              onChange={handleInputChange}
              className={"input"}
              required
            >
              <option value="" defaultValue={""} disabled hidden>
                Education
              </option>
              <option value="secondarySchool">Secondry school</option>
              <option value="highSchool">High school</option>
              <option value="underGraduate">Under Graduate</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>
          <div className={"formGroup"}>
            <label className={"label"}>Study with board?</label>
            <br />

            <input
              type="radio"
              value={board}
              onChange={(e) => setboard(true)}
              required
              name="board"
              className="radio1"
            />
            <label>Board</label>

            <input
              type="radio"
              value={board}
              required
              name="board"
              className="radio"
            />
            <label>Normal</label>
          </div>
          <br />
          <div className="formGroup">
            <button type="submit" className={"button"}>
              Sign up
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
