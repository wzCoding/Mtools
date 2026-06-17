import i18n from 'i18next'
import resources from '../../src/i18n/lang.json'

i18n.init({
  resources,
  lng: 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
