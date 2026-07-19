import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { EPISODES } from './episodes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Shell() {
  const { pathname } = useLocation()
  const current = EPISODES.find((e) => pathname.startsWith(e.path))

  return (
    <div className="min-h-screen bg-night">
      <Navbar sections={current?.sections ?? []} />
      <Routes>
        <Route path="/" element={<Home />} />
        {EPISODES.map((e) => (
          <Route key={e.path} path={e.path} element={<e.component />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Shell />
    </BrowserRouter>
  )
}
