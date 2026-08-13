import React, {  useEffect, useState } from 'react'
import google from "../image/google.png";
import apple from "../image/apple.png";
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from '.././../Firebase/firebase';

function Login() {
     const navigate = useNavigate() 
    const [input,setInput] = useState({username:'',password:''})
     const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []); 
  
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
     navigate('/');
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };
  


  return (
    <div className='login-wrap'>
        <div class="login_form">
    
    <form onSubmit={handleLogin}>
      <h3>Log in with</h3>
      <div class="login_option">
       
        <div class="option">
          <a onClick={handleLogin} href="#">
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