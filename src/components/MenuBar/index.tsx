import { Button, Tooltip, Popover, Select, Switch } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PictureOutlined, AppstoreOutlined, SettingOutlined, TranslationOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import './index.less'

const menus = [
    {
        title: '首页',
        icon: <AppstoreOutlined />,
        path: '/home'
    },
    {
        title: '图片去水印',
        icon: <PictureOutlined />,
        path: '/re-watermark'
    },
]

const settings = [
    {
        title: '语言',
        icon: <TranslationOutlined />,
        type: 'select',
        options: [{ value: 'zh-CN', label: '中文' }, { value: 'en', label: '英语' }],
        defaultValue: 'zh-CN',
        key: 'lang'
    },
    {
        title: '主题',
        icon: <SunOutlined />,
        type: 'switch',
        checked: <SunOutlined />,
        unchecked: <MoonOutlined />,
        key: 'theme'
    }
]

const settingsContent = settings.map((item) => {
    return (
        <div className='menu-setting-item' key={item.key}>
            <div className='setting-item-title'>
                {item.icon}
                <span>{item.title}</span>
            </div>
            {item.type === 'select' && <Select className='setting-option' options={item.options} defaultValue={item.defaultValue}></Select>}
            {item.type === 'switch' && <Switch className='setting-option' checkedChildren={item.checked}
                unCheckedChildren={item.unchecked}
                defaultChecked></Switch>}
        </div>
    )
})

export default function MenuBar() {
    const navigate = useNavigate()
    const location = useLocation()

    const openSetting = () => { }
    /** 当前激活的路径 */
    const activePath = useMemo(() => {
        // 精确匹配 /home、/re-watermark
        const matched = menus.find((m) => location.pathname.startsWith(m.path))
        return matched?.path ?? ''
    }, [location.pathname])

    return (
        <div className="menu-bar">
            {
                menus.map(item => {
                    const isActive = activePath === item.path

                    return (
                        <Button
                            key={item.title}
                            type='text'
                            className={`menu-item${isActive ? ' menu-item--active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <Tooltip placement='right' title={item.title}>
                                {item.icon}
                            </Tooltip>
                        </Button>
                    )
                })
            }
            <Popover placement="topLeft" trigger="click" content={settingsContent}>
                <Button
                    key='setting'
                    type='text'
                    className={`menu-item menu-item-setting`}
                    onClick={() => openSetting}
                >
                    <Tooltip placement='right' title={'设置'}>
                        <SettingOutlined />
                    </Tooltip>
                </Button>
            </Popover>
        </div>
    )
}