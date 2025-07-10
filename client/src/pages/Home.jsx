import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const Speak = (text) => {
    console.log("Speak called with:", text);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      utterance.voice = voices.find((v) => v.lang === "en-US") || voices[0];

      utterance.onstart = () => {
        console.log("Speaking started");
        isSpeakingRef.current = true;
      };

      utterance.onend = () => {
        console.log("Speaking ended");
        isSpeakingRef.current = false;

        if (recognitionRef.current && !isRecognizingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Error restarting recognition:", err);
          }
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e.error);
        isSpeakingRef.current = false;
      };

      synth.cancel(); // Ensure no overlap
      synth.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  const handleCommand = async (data) => {
    const { type, response } = data;
    const query = encodeURIComponent(response);

    const urlMap = {
      google_search: `https://www.google.com/search?q=${query}`,
      calculator_open: `https://www.google.com/search?q=calculator`,
      instagram_open: `https://www.instagram.com/`,
      linkedin_open: `https://www.linkedin.com/`,
      facebook_open: `https://www.facebook.com/`,
      weather_show: `https://www.google.com/search?q=weather`,
      notion_open: `https://www.notion.so/`,
      youtube_search: `https://www.youtube.com/results?search_query=${query}`,
      youtube_play: `https://www.youtube.com/results?search_query=${query}`,
    };

    if (urlMap[type]) {
      window.open(urlMap[type], "_blank");
    }
  };

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
    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListing(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListing(false);

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard : ", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListing(false);
        const data = await getGeminiResponse(transcript);
        console.log(data);
        Speak(data.response || "Sorry, I couldn't understand that.");
        handleCommand(data);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListing(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      setListing(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("Recognition manually stopped");
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setListing(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-t from-black to-[#0a0a30] flex justify-center items-center flex-col gap-6 px-4">
      {/* Top Navigation */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <button
          className="hidden md:inline-block px-6 py-3 rounded-full bg-white text-black font-semibold text-lg transition-transform transform hover:scale-105 hover:shadow-lg"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>
        <button
          className="hidden md:inline-block px-6 py-3 rounded-full bg-white text-black font-semibold text-lg transition-transform transform hover:scale-105 hover:shadow-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-0 right-0 w-2/3 max-w-xs h-full bg-[#111127] z-50 flex flex-col items-start p-6 space-y-6 transition-all duration-300 shadow-lg">
          <button
            className="text-white text-xl w-full text-left border-b border-gray-700 pb-2 hover:text-gray-300"
            onClick={() => {
              stopListening();
              navigate("/customize");
              setMenuOpen(false);
            }}
          >
            Customize Your Assistant
          </button>
          <button
            className="text-white text-xl w-full text-left border-b border-gray-700 pb-2 hover:text-gray-300"
            onClick={() => {
              stopListening()
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Assistant Image */}
      <div className="w-72 max-w-full h-96 sm:h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border border-gray-700 bg-black/30 backdrop-blur">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white text-xl sm:text-2xl font-semibold mt-4 text-center">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
}

export default Home;
