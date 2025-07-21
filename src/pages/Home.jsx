import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import appdashboard from '../../public/AppDashboard.jpg'

function Home() {
   
   const nav = useNavigate()

  return (
    <div>
       <Navbar />
     <div className="min-h-screen   flex flex-col items-center px-6 md:px-12">
  
      
      <section className="text-center mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Build the habits that <span className="text-red-600">matter!</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Feeling overwhelmed? Our easy-to-use habit tracker helps you take control of your day and achieve your goals.
        </p>
        <button onClick={()=>nav('/login')} className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 cursor-pointer">
          Let's get started!
        </button>
      </section>

    
      <section className="mt-12">
        <img
          src={appdashboard}
          alt="App dashboard"
          className="w-full max-w-4xl rounded-xl shadow-xl"
        />
      </section>
    </div>
    </div>
  )
}

export default Home