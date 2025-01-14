import React, { use, useState } from "react";

const Login = () => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
 

    const checkLoginInfo = async (event) => {
        event.preventDefault();
        if (!emailValue || !passwordValue) {
            return;
        }
        else {
            try {
                const response = await fetch('http://localhost:8080/verifyUser', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: emailValue,
                        password: passwordValue,
                    }),
                });

                const data = await response.json()
                if (!response.ok)
                {
                    throw new Error('Failed to verify user');
                }
                else if (data.email === emailValue && data.password === passwordValue)
                {
                    window.location.href = "http://localhost:5173/search";
                }
            }
            catch (error) {
                console.error('Login failed:', error);
            }
        }
    }

    const redirectSignup = (event) => {
        window.location.href = "http://localhost:5173/signup";
    }

    return(
        <div className="LoginContainer">
            <form onSubmit={checkLoginInfo}>
                <div>
                    Email 
                    <input type="text" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}></input>
                </div>
                <div>
                    Password 
                    <input type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)}></input>
                </div>
                <button>Login</button>
                <button onClick={redirectSignup}>Sign up</button>
            </form>
        </div>
    )

};

export default Login;