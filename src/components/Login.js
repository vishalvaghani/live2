import { useState } from "react";
import { useAuth } from "../hooks/AuthProvider";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const auth = useAuth();
  const handleSubmitEvent =async  (e) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
        const resapi =await  auth.loginAction(input);
        debugger
        if(resapi.data.length >= 0){
            alert(resapi.message);
        }else{
            alert(resapi.message);
        }
        
      return;
      //dispatch action from hooks
    }else{
    debugger;
    alert("please provide a valid input");
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmitEvent}>
      <div className="form_control">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="user-email"
          name="username"
          placeholder="username"
          aria-describedby="user-email"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-email" className="sr-only">
          Please enter a valid username. It must contain at least 6 characters.
        </div>
      </div>
      <div className="form_control">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-password" className="sr-only">
          your password should be more than 6 character
        </div>
      </div>
      <button className="btn-submit">Submit</button>
    </form>
  );
};

export default Login;