import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resources from './lang.json'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  })

/** 全局翻译函数，组件内外均可直接调用，无需引入 useTranslation */
const $t = i18n.t.bind(i18n)

// 挂载到 window，使项目中任意位置可直接使用 $t('xxx')
window.$t = $t

export { $t }
export default i18n
