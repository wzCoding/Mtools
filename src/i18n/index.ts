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

const $t = i18n.t.bind(i18n)

window.$t = $t

export { $t }
export default i18n
