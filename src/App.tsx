import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { HomeView } from '@/pages/HomeView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
