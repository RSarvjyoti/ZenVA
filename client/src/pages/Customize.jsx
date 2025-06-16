import React, { useRef, useState } from "react";
import Card from "../components/Card";
import VA1 from "../assets/VA1.jpg";
import VA2 from "../assets/VA2.jpg";
import VA3 from "../assets/VA3.jpg";
import { FaFileUpload } from "react-icons/fa";

function Customize() {
  const [frontImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null)
  const inputImage = useRef();

  const handleImage = async (e) => {
   const file =  e.target.files[0];
   setBackendImage(file);
   setFrontendImage(URL.createObjectURL(file));
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020256] flex justify-center items-center flex-col p-[20px]">
      <h1 className="text-white text-[30px] text-center p-[20px]">
        Select your <span className="text-sky-600">Assistant Image</span>
      </h1>
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px] ">
        <Card image={VA1} />
        <Card image={VA2} />
        <Card image={VA3} />

        <div
          className="relative w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#191969] rounded-2xl overflow-hidden
     hover:shadow-2xl hover:shadow-blue-950 hover:border-2 hover:border-white cursor-pointer 
     flex justify-center items-center "
     onClick={() => inputImage.current.click()}
        >
          {!frontImage && <FaFileUpload className="text-white w-[30px] h-[30px] " />}
          {frontImage && <img  src={frontImage} alt="Your ZenVA" className="h-full w-full object-cover" />}

        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden
        onChange={handleImage} />
      </div>

      <button className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] cursor-pointer ">
        Next
      </button>
    </div>
  );
}

export default Customize;
