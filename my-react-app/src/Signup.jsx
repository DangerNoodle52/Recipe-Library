import React, { use, useState } from 'react';
import './signup.css';

const Signup = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState('');

  const saveSignupInfo = async (event) => {
    event.preventDefault();
    if (!emailValue || !passwordValue) {
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/createUser', {
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
        console.log('Error response data:', data);
        if (data.error === 'Email already exists') {
          // setError('Email already exists');
        } else {
          setError('Failed to create user');
        }
        // throw new Error(data.error || 'Failed to create user');
        alert(data.error || 'Failed to create user');
      } else {
        setError('');
        redirectLogin();
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
    //window.location.href = 'http://localhost:5173';
  };

  const redirectLogin = (event) => {
    window.location.href = 'http://localhost:5173/search';
  };

  return (
    <div className='SignupContainer'>
      <form onSubmit={saveSignupInfo}>
        <div>
          Username
          <input
            type='email'
            id='email'
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            required
          ></input>
        </div>
        <div>
          Password
          <input
            type='password'
            id='password'
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          ></input>
        </div>
        {/* {error && <div className='error-message'> {error}</div>} */}
        <button type='submit'>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
