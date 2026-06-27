import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import TitleBar from './components/TitleBar'
import MenuBar from './components/MenuBar'
import { PageTransition } from './components/PageTransition'
import { routes, DEFAULT_PATH } from '@/router/index'
import './App.less'

/** 监听全局截图快捷键，自动导航到截图页面 */
function ShortcutNavigator() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.bridgeApis?.onScreenshotShortcutTriggered) return

    window.bridgeApis.onScreenshotShortcutTriggered(() => {
      // 使用 HashRouter 的 navigate 跳转到截图页面
      navigate('/screenshot')
    })
  }, [navigate])

  return null
}

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
      <ShortcutNavigator />
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
