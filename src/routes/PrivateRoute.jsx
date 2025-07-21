import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'


function PrivateRoute({ children }) {
    const {currentUser,loading} = useAuth()
     //console.log(currentUser)
    if(loading)
        return <h1 className='text-center mt-3.5xl font-semibold'>Loading..</h1>
     
    return  currentUser ? children: <Navigate to='/' /> 
}

export default PrivateRoute