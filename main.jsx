import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import TrackUser from './TrackUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/track" element={<TrackUser />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)