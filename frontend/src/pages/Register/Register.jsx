import React from 'react';
import './Register.scss';
import '../../App.scss';

const Register = () => {
  return (
    <>
      <title>Register</title>
      <div className='register'>
        <div className='register__container'>
          <h1 className='register__title'>Create Account</h1>
          <form className='register__form'>
            <div className='register__form-group'>
              <input
                required
                type='text'
                placeholder='Username'
                className='register__input'
              />
            </div>
            <div className='register__form-group'>
              <input
                required
                type='email'
                placeholder='Email'
                className='register__input'
              />
            </div>
            <div className='register__form-group'>
              <input
                required
                type='password'
                placeholder='Password'
                className='register__input'
              />
            </div>
            <div className='register__form-group'>
              <input
                required
                type='password'
                placeholder='Confirm Password'
                className='register__input'
              />
            </div>
            <button type='submit' className='register__button'>Sign Up</button>
            <div className='register__footer'>
              <p className='register__text'>Already have an account?</p>
              <a href='./login' className='register__link'>Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
