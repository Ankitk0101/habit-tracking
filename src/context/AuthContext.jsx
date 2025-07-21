import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/config'

const authContext = createContext()
export const useAuth = () => useContext(authContext)

export const AuthProvider = ({children})=>{ 
  const [currentUser, setCurrentUser] = useState(null)
  const [search, setSearch] = useState("")
  const [loading , setLoading] = useState(true)

  useEffect(()=>{
    const subscribe = onAuthStateChanged(auth , (user)=>{
    setCurrentUser(user)
    setLoading(false)
  })
  return ()=> subscribe()
  },[])

 const login = (email ,password)=>signInWithEmailAndPassword(auth, email , password);
 const signup = (email ,password)=> createUserWithEmailAndPassword(auth,email,password)  
 const logout = () => signOut(auth)


  return (
    <>
        <authContext.Provider value={{currentUser,loading,search ,setSearch, login , signup , logout}}>
            {children}
        </authContext.Provider>
    </>
  )
}


 

 