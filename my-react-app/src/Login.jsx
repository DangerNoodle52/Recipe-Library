import React, { useEffect, use, useState } from 'react';

const Login = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const checkLoginInfo = async (event) => {
    event.preventDefault();
    if (!emailValue || !passwordValue) {
      return;
    }
    console.log('Form data being sent:', {
      email: emailValue,
      password: passwordValue,
    });
    try {
      const response = await fetch('http://localhost:8080/verifyUser', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify user');
      }
      if (data.authenticated) {
        console.log('User authenticated:', data.user);
        window.location.href = 'http://localhost:5173/search';
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('An error occurred during login');
    }
  };

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/isLoggedIn', {
  //         credentials: 'include',
  //       });
  //       const data = await response.json();
  //       if (data.loggedIn) {
  //         window.location.href = 'http://localhost:5173/search';
  //       }
  //     } catch (error) {
  //       console.error('Error checking login status:', error);
  //     }
  //   };
  //   checkLoginStatus();
  // }, []);

  //changed path for redirect from /signup to /login and renamed function
  const redirectSignup = (event) => {
    window.location.href = 'http://localhost:5173/signup';
  };

  return (
    <div className='LoginContainer'>
      <form onSubmit={checkLoginInfo}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={emailValue}
            placeholder='Email'
            onChange={(e) => setEmailValue(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor='Password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Password'
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          ></input>
        </div>
        <button type='submit'>Login</button>
        <button onClick={redirectSignup}>Sign up</button>
      </form>
    </div>
  );
};

export default Login;
