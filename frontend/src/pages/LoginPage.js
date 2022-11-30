import styles from "./LoginPage.module.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

// import { useSignup } from "../hooks/useSignup";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  //const {signup, error, isLoading} = useSignup();

  const handleSubmit = async () => {
    const u = document.querySelector("#userInput").value;
    const p = document.querySelector("#passwordInput").value;

    if (isSignUp){
      try {

        const config = { 
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({username: u, password: p})
        };

        let x = await fetch('http://localhost:5000/api/user/', config);
        x = await x.json();

        console.log(x);
        localStorage.setItem('userInfo', JSON.stringify(x));
        console.log('request sent');
        nav("/");
      } catch(err) {
        //use toast later 
        console.log(err);
      }
    } else {
      try {
        const config = { 
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({username: u, password: p})
        };
        //console.log(JSON.parse(JSON.stringify({username: u, password: p})));
        let x = await fetch('http://localhost:5000/api/user/login', config);
        x = await x.json();
        localStorage.setItem('userInfo', JSON.stringify(x));
        console.log('request sent');
        
        nav("/");
      } catch(error) {
        //use toast later 
        console.log(error);
      }
    }
    
    
    //await signup(u, p);
  };

  
  return (
    <div className={styles.loginPage}>
      <div className={styles.signUpWidgetDiv}>
        <img
          className={styles.companyLogoIcon}
          alt=""
          src="../companylogo@2x.png"
        />
        <b className={styles.signUpB}>{isSignUp ? 'Sign Up' : 'Login'}</b>
        <div className={styles.usernameBoxDiv}>
        <span className={styles.usernameSpan} >Username:</span>
          <input className={styles.usernameFieldInput} id = "userInput" type="text" />
        </div>
        <div className={styles.passwordBoxDiv}>
          <span className={styles.usernameSpan}>Password:</span>
          <input className={styles.usernameFieldInput} id = "passwordInput" type="text" />
        </div>
        <button className={styles.signUpButton} onClick={handleSubmit}>
          <div className={styles.signUpTextDiv}>{isSignUp ? 'Sign Up' : 'Login'}</div>
        </button>
        <span className={styles.redirectSpan} onClick={()=>{setIsSignUp(!isSignUp)}}>
          {isSignUp ? 'Already a member? Login here' : 'New user? Sign up here'}
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
