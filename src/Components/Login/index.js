import React, { use, useState } from 'react'
import google from "../image/google.png";
import apple from "../image/apple.png";
import { useNavigate } from 'react-router-dom';
function Login() {
     const navigate = useNavigate() 
    const [input,setInput] = useState({username:'',password:''})

   const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: input.username,
        password: input.password,
        expiresInMins: 1
      })
    });

    const data = await res.json();
    localStorage.setItem("access_token", data.accessToken);
    console.log("data>>>>",data);
    
    navigate("/");
  } catch (err) {
    console.log("login error:", err);
  }
};


  return (
    <div className='login-wrap'>
        <div class="login_form">
    
    <form onSubmit={handleLogin}>
      <h3>Log in with</h3>
      <div class="login_option">
       
        <div class="option">
          <a href="#">
            <img src={google} alt="Google" />
            <span>Google</span>
          </a>
        </div>
       
        <div class="option">
          <a href="#">
            <img src={apple} alt="Apple" />
            <span>Apple</span>
          </a>
        </div>
      </div>
      
      <p class="separator">
        <span>or</span>
      </p>
      
      <div class="input_box">
        <label for="email">Email</label>
        <input  value={input.username} onChange={(e)=> setInput({...input,username:e.target.value})}  type="text" id="email" placeholder="Enter email address" required />
      </div>
     
      <div class="input_box">
        <div class="password_title">
          <label for="password">Password</label>
          <a href="#">Forgot Password?</a>
        </div>
        <input value={input.password} onChange={(e)=> setInput({...input,password:e.target.value})} type="password" id="password" placeholder="Enter your password" required />
      </div>
      
      <button type="submit">Log In</button>
      <p class="sign_up">Don't have an account? <a href="#">Sign up</a></p>
    </form>
  </div>
    </div>
  )
}

export default Login