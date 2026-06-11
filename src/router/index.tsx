import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

/**
 * 懒加载包装器
 */
function lazyWithSuspense(
  importer: () => Promise<{ default: ComponentType<any> }>
): LazyExoticComponent<ComponentType<any>> {
  return lazy(importer)
}

/** 页面加载 fallback */
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

/** 包装懒加载页面 */
function LazyPage({ Component }: { Component: LazyExoticComponent<ComponentType<any>> }) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}

// ──── 懒加载视图 ────
const Home = lazyWithSuspense(() => import('@/views/Home'))
const ReWatermark = lazyWithSuspense(() => import('@/views/Re-watermark'))

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
    title: '首页',
    element: <LazyPage Component={Home} />,
  },
  {
    path: '/re-watermark',
    title: '图片去水印',
    element: <LazyPage Component={ReWatermark} />,
  },
]

/** 默认首页路径 */
export const DEFAULT_PATH = '/home'

/** 所有有效路径 */
export const routePathSet = new Set(routes.map((r) => r.path))
