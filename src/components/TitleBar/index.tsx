import SvgIcon from '@/components/SvgIcon'
import './index.less'

const logo = '/electron.png'

export default function TitleBar() {
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
                    <SvgIcon name="minimize" color='#303133' />
                </button>
                <button onClick={handleMaximize} className="title-bar-button maximize" title={$t('maximize')}>
                    <SvgIcon name="maximize" color='#303133' />
                </button>
                <button onClick={handleClose} className="title-bar-button close" title={$t('close')}>
                    <SvgIcon name="close" color='#303133' />
                </button>
            </div>
        </div>
    )
}