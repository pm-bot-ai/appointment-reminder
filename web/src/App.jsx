import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Appointments from './pages/Appointments'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/customers" element={<Layout><Customers /></Layout>} />
      <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
      <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
    </Routes>
  )
}

export default App
