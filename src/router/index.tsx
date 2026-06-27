import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function lazyWithSuspense(
  importer: () => Promise<{ default: ComponentType<any> }>
): LazyExoticComponent<ComponentType<any>> {
  return lazy(importer)
}

function PageLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
    </div>
  )
}

function LazyPage({ Component }: { Component: LazyExoticComponent<ComponentType<any>> }) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}

const Home = lazyWithSuspense(() => import('@/views/Home'))
const ReWatermark = lazyWithSuspense(() => import('@/views/Re-watermark'))
const Screenshot = lazyWithSuspense(() => import('@/views/Screenshot'))
/**
 * 路由配置
 *
 * 使用 HashRouter 而非 BrowserRouter：
 *   Electron 使用 file:// 协议加载页面，BrowserRouter 依赖服务端路由，
 *   而 HashRouter 通过 URL hash (#) 管理路由，与 file:// 完美兼容。
 *
 * 新增页面：
 *   1. 在下方 routes 数组中追加一项
 *   2. 在 src/components/MenuBar/index.tsx 的 menus 数组中追加菜单项
 */
export interface RouteConfig {
  path: string
  title: string
  element: ReactNode
}

export const routes: RouteConfig[] = [
  {
    path: '/home',
    title: 'home',
    element: <LazyPage Component={Home} />,
  },
  {
    path: '/re-watermark',
    title: 'remove-watermark',
    element: <LazyPage Component={ReWatermark} />,
  },
  {
    path: '/screenshot',
    title: 'screenshot',
    element: <LazyPage Component={Screenshot} />,
  },
]

export const DEFAULT_PATH = '/home'

export const routePathSet = new Set(routes.map((r) => r.path))
