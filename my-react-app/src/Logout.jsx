import React, { useState, isLoggedin } from 'react';

const logout = () => {
  const [loggedIn, setloggedIn] = useState(isLoggedIn);
  setLoggedIn(false);
  return (
    <div className='logoutContainer'>
      <form onSubmit={logout}>
        <button>Logout</button>
      </form>
    </div>
  );
};

export default logout;
