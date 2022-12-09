import React from 'react'
import { useRef } from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { useState } from 'react'

function Auth(props) {

    const emailRef = useRef()
    const passRef = useRef()

    const [loginError, setLoginError] = useState("")

    function login(){
        
        signInWithEmailAndPassword(props.firebase.current.auth, emailRef.current.value, passRef.current.value).then(userCredentials => {
            
        }).catch(err => {
            
            setLoginError(err.message)
        })
        
    }
    function createAccount(){
        createUserWithEmailAndPassword(props.firebase.current.auth, emailRef.current.value, passRef.current.value).then(userCredentials => {

        }).catch(err => {
            setLoginError(err.message)
        })
    }

  return (
    <div className='authWindow'>
        Login
        <input ref={emailRef} placeholder="Email"></input>
        <input ref={passRef}  placeholder="Password" type={"password"}></input>
        <button onClick={createAccount}>Create Account</button>  
        <button onClick={login}>Login</button>        
        <div className='errorMessage'>
            {loginError}
        </div>
    </div>
  )
}

export default Auth