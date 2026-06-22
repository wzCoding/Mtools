import { useState, useEffect, useCallback, useMemo } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { ThemeContext, type Theme } from '@/context/ThemeContext'

const THEME_KEY = 'mtools-theme'

function getSystemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage 不可用时忽略
  }
  return null
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? getSystemTheme()
  })

  // 初始化时应用主题
  useEffect(() => {
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
    try {
      localStorage.setItem(THEME_KEY, t)
    } catch {
      // 忽略
    }
  }, [])

  // 监听系统主题变化（仅在用户未手动设置时生效）
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        const systemTheme: Theme = e.matches ? 'dark' : 'light'
        setThemeState(systemTheme)
        applyTheme(systemTheme)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  const themeConfig = useMemo(() => ({
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#0088e9',
    },
    components: {
      Modal:{
        contentBg:'var(--bg-card)',
      }
    }
  }), [theme])

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
