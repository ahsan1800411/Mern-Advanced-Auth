import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterScreen.css';

const RegisterScreen = ({ history }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/');
    }
  }, [history]);

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (password !== confirmpassword) {
      setPassword('');
      setConfirmpassword('');
      setTimeout(() => {
        setError('');
      }, 5000);
      return setError("Password does'nt match");
    }
    try {
      const { data } = await axios.post(
        '/api/auth/register',
        { username, email, password },
        config
      );
      localStorage.setItem('authToken', data.token);
      history.push('/');
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <div className='register-screen'>
      <form onSubmit={registerHandler} className='register-screen__form'>
        <h3 className='register-screen__title'>Register</h3>
        {error && <span className='error-message'>{error}</span>}
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            className='form-control'
            required
            id='name'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            className='form-control'
            required
            id='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            className='form-control'
            required
            id='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='confirmpassword'>Confirm Password:</label>
          <input
            type='password'
            className='form-control'
            required
            id='confirmpassword'
            placeholder='Enter Confirm Password'
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'>Register</button>
        <span className='register-screen__subtext'>
          Already have an account? <Link to='/login'>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterScreen;
