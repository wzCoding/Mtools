import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import TitleBar from './components/TitleBar'
import MenuBar from './components/MenuBar'
import { routes, DEFAULT_PATH } from '@/router/index'
import './App.less'

function App() {
  return (
    <HashRouter>
      <div className='app-container'>
        <TitleBar />
        <div className='page-container'>
          <MenuBar />
          <div className='page-box'>
            <Routes>
              {/* 根路径重定向到首页 */}
              <Route path='/' element={<Navigate to={DEFAULT_PATH} replace />} />

              {/* 动态注册所有页面路由 */}
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}

              {/* 404 兜底 */}
              <Route path='*' element={<Navigate to={DEFAULT_PATH} replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
