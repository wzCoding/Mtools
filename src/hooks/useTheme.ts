import { useThemeContext } from '@/context/ThemeContext'
import type { Theme } from '@/context/ThemeContext'

export type { Theme }

/**
 * 获取/设置主题的 Hook。
 * 状态由 ThemeProvider 统一管理，此处仅从 Context 消费。
 */
export function useTheme() {
  return useThemeContext()
}
