import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { userData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };


  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterence);
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard", transcript);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        const data = await getGeminiResponse(transcript);
        console.log(data);
        speak(data.response);
      }
    };

    recognition.start();

    // recognition.onerror = (event) => {
    //   console.error("Speech recognition error", event.error);
    // };

    // return () => {
    //   recognition.stop();
    // };
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#0a0a30] flex justify-center items-center flex-col gap-[15px] ">
      <button
        type="button"
        className="absolute top-[20px] right-[20px] min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        type="button"
        className=" absolute top-[100px] right-[20px] px-[20px] py-[10px] min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full object-cover rounded-4xl shadow-lg"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
}

export default Home;
