import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverURL = "http://localhost:8080/api";

  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${serverURL}/user/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(
        "Current user fetch error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider value={{ serverURL, userData, setUserData }}>
      {children};
    </userDataContext.Provider>
  );
}

export default UserContext;
