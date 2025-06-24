import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    serverURL,
    userData,
    setUserData,
    frontImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  return (
    <div
      className={`relative w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#191969] rounded-2xl overflow-hidden
     hover:shadow-2xl hover:shadow-blue-950 hover:border-2 hover:border-white cursor-pointer
      ${selectedImage==image?"border-2 border-white shadow-2xl shadow-blue-950" : null} `}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <span className="absolute top-2 right-2 flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
      </span>
      <img
        src={image}
        alt="Your ZenVA"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default Card;
