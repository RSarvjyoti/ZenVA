import React, { useContext, useState } from "react";
import bg1 from "../assets/bg1.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { userDataContext } from "../context/UserContext.jsx";

function Signin() {
  const {serverURL, userData, setUserData} = useContext(userDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${serverURL}/auth/signin`, {
        email,
        password,
      });
      const { token, user } = res.data;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserData(res.data);
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      console.error(
        "Signup failed",
        error.response?.data?.message || error.message
      );
      setUserData(null);
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center "
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[90%] h-[600px] max-w-[500px]  bg-[#00000069] backdrop-blur shadow-lg  shadow-black rounded
      flex flex-col items-center justify-center gap-[20px] px-[20px] "
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] ">
          Login to <span className="text-blue-400">ZenVA</span>{" "}
        </h1>
       
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent
        text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] cursor-pointer"
        />
        <div
          className="w-full h-[60px] border-2 border-white bg-transparent
        text-white rounded-full text-[18px] relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full h-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] cursor-pointer "
          />
          {!showPassword && (
            <IoMdEye
              className="absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}

          {showPassword && (
            <IoMdEyeOff
              className="absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        <button
          type="submit"
          className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[30px] cursor-pointer "
          disabled={loading}
        >
         {loading?"Loading...":"Sign In"}
        </button>
        <p
          className="text-white text-[18px]"
          onClick={() => navigate("/signup")}
        >
          If you dont't have an acount ?
          <span className="text-blue-400 cursor-pointer">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
