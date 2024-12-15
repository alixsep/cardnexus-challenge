import type { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Toaster } from '@/components/ui/sonner'
import NotFound from '@/pages/not-found'
import HomePage from '@/pages/home'

const App: FC = () => {
  return (
    <Router>
      {/* <Toaster /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
