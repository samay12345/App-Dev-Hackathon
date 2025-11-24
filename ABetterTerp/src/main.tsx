import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.tsx'
import Register from './pages/Register.tsx'
import Login from './pages/LogInPage.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </BrowserRouter>

)