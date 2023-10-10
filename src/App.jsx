import Footer from './components/Footer/Footer'
import './App.css'
import Header from './components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import Auth from './components/Auth/Auth'
import GroupDetails from './pages/GroupDetails/GroupDetails'
import UserProfile from './pages/UserProfile/UserProfile'

function App() {
  

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/group/:group" element={<GroupDetails />} />
        <Route path="/user/:user" element={<UserProfile  />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
