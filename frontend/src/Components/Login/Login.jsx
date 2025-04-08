import React from 'react'
import './Login.scss'
import '../../App.scss'

const Login = () => {
    return (
        <>
        <title>Login</title>
        <div className='login'>
            <div className='login__container'>
                <h1 className='login__title'>Welcome Back!</h1>
                <form className='login__form'>
                    <div className='login__form-group'>
                        <input required type='email'placeholder='Email'className='login__input'/>
                    </div>
                    <div className='login__form-group'>
                        <input required type='password' Placeholder='Password' className='login__input' />
                    </div>
                    <button type='submit' className='login__button'>Sign In</button>
                    <div className='login__footer'>
                       {/* <a href='#' className='login__link'>Forgot Password?</a> */}
                        <a href='./register' className='login__link'>Create Account</a>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
};

export default Login