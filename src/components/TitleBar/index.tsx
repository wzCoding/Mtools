import { SvgIcon } from '@/components/SvgIcon'
import './index.less'
import { useTranslation } from 'react-i18next'

const logo = './tools.ico'

export default function TitleBar() {
    const { t: $t } = useTranslation();

    const handleMinimize = () => {
        window.bridgeApis.minimize();
    }
    const handleMaximize = () => {
        window.bridgeApis.maximize();
    }
    const handleClose = () => {
        window.bridgeApis.close();
    }
    return (
        <div className="title-bar">
            <div className="title-bar-drag-region">
                <img src={logo} alt="logo" />
                <span className="title-bar-title">Mtools</span>
            </div>
            <div className="title-bar-buttons">
                <button onClick={handleMinimize} className="title-bar-button minimize" title={$t('minimize')}>
                    <SvgIcon name="minimize" style={{ fontSize: 22 }} />
                </button>
                <button onClick={handleMaximize} className="title-bar-button maximize" title={$t('maximize')}>
                    <SvgIcon name="maximize" style={{ fontSize: 20 }} />
                </button>
                <button onClick={handleClose} className="title-bar-button close" title={$t('close')}>
                    <SvgIcon name="close" style={{ fontSize: 20 }} />
                </button>
            </div>
        </div>
    )
}