import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import zIndex from "@mui/material/styles/zIndex";
import { openContext } from "../context/isopen";
import { AuthContext } from "../context/authcontext";
import { IoMdClose } from "react-icons/io";

const OptionsComponent = (props) => {
  const {user} = useContext(AuthContext)
  const isopen = useContext(openContext);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");
  const [first, setfirst] = useState(0);

  useEffect(() => {
    const firstapp = async () => {
      const response = await axios.get(
        "http://localhost:3000/" + props.subject,
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        options.push(response.data[index].name);
        setfirst(1);
      }
    };
    firstapp();
  }, [options]);

  // Function to handle selection of an option
  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  };

  // Function to handle change in the new option input
  const handleNewOptionChange = (e) => {
    setNewOption(e.target.value);
  };

  // Function to add a new option to the list
  const handleAddOption = () => {
    console.log("function works");
    if (newOption.trim() && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption("");
    }
  };
  const submitOption = async ()=>{
    console.log(user);
    try {
      isopen.setisOpen(false);
      const response = await axios.post(
        "http://localhost:3000/setoption",
        { option: selectedOption, subject: props.subject,user:user.email },
        { withCredentials: true }
      );
  
      console.log(response); 
    } catch (error) {
      throw error;
    }
  }

  const closeMenu = () => {
    isopen.setisOpen(false);
  };
  if (isopen.isOpen) {
    return (
      <div className="selectDiv">
        <button onClick={closeMenu} className="selectClose btn btn-light"><IoMdClose className="closeIcon" /></button>
        <h1>Select a Topic</h1>
        <select
          value={selectedOption}
          onChange={handleSelectOption}
          
        >
          <option value="" disabled>
            Select an Topic
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p>Selected Option: {selectedOption}</p>

        <div>
          <input
            type="text"
            value={newOption}
            onChange={handleNewOptionChange}
            
            placeholder="Add new option"
          />
          <button className="btn btn-dark" onClick={handleAddOption} >
            Add
          </button> 
        </div>
        <button onClick={submitOption} className="btn subBtn">Submit</button>
      </div>
    );
  } else {
    return "";
  }
};



export default OptionsComponent;
