import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import TitleBar from './components/TitleBar'
import MenuBar from './components/MenuBar'
import { PageTransition } from './components/PageTransition'
import { routes, DEFAULT_PATH } from '@/router/index'
import './App.less'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Navigate to={DEFAULT_PATH} replace />} />

        {/* 动态注册所有页面路由 */}
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PageTransition>{route.element}</PageTransition>}
          />
        ))}

        {/* 404 */}
        <Route path='*' element={<Navigate to={DEFAULT_PATH} replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <HashRouter>
      <div className='app-container'>
        <TitleBar />
        <div className='page-container'>
          <MenuBar />
          <div className='page-box'>
            <AnimatedRoutes />
          </div>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
