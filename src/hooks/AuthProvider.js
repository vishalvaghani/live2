import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const loginAction = async (data) => {
    try {
      debugger
      const response = await fetch("http://localhost:8801/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      debugger
      
      const res = await response.json();
      debugger;
      if (res.data.length > 0) {
        setUser(res.data[0]);
        navigate("/dashboard");
        return res;

      }else{
        navigate("/login");
        return res;
      }
      // throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    navigate("/login");
  };
  return(
  <AuthContext.Provider value={{ user, loginAction, logOut }}>
    {children}
  </AuthContext.Provider>
  )
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};