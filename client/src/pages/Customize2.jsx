import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import {useNavigate} from "react-router-dom"

function Customize2() {
  const { userData, backendImage, selectedImage, serverURL, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageURL", selectedImage);
      }

      const token = localStorage.getItem("token");

      const result = await axios.post(
        `${serverURL}/user/update-assistant`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false)
      console.log(result.data);
      setUserData(result.data);

    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020256] flex justify-center items-center flex-col p-[20px]">
      <IoIosArrowBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer " 
       onClick={() => navigate('/customize') }  />
      <h1 className="text-white text-[30px] text-center p-[20px]">
        Enter your <span className="text-sky-600">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="Enter Your Assistant Name"
        value={assistantName}
        required
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
        text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] cursor-pointer "
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] bg-white rounded-full text-black
         font-semibold text-[19px] mt-[30px] cursor-pointer "
         
          onClick={() => {
            handleUpdateAssistant();
            navigate('/')
          }}
          disabled ={loading}
        >
         {!loading?"Finally Create Your Assistant":"Loading..."}
          
        </button>
      )}
    </div>
  );
}

export default Customize2;
