import { Button, Tooltip, Popover, Select, Switch } from 'antd'
import { useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PictureOutlined, AppstoreOutlined, SettingOutlined, TranslationOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import './index.less'

const menus = [
    {
        title: 'home',
        icon: <AppstoreOutlined />,
        path: '/home'
    },
    {
        title: 'remove-watermark',
        icon: <PictureOutlined />,
        path: '/re-watermark'
    },
]

export default function MenuBar() {
    const navigate = useNavigate()
    const location = useLocation()

    // 订阅语言变更，驱动组件重渲染
    useTranslation()

    /** 切换语言 */
    const handleLangChange = useCallback((value: string) => {
        i18n.changeLanguage(value)
    }, [])

    /** 设置项配置——放在组件内，语言切换时 $t() 重新求值 */
    const settings = useMemo(() => [
        {
            title: 'language',
            icon: <TranslationOutlined />,
            type: 'select' as const,
            options: [
                { value: 'zh', label: $t('chinese') },
                { value: 'en', label: $t('english') },
            ],
            defaultValue: i18n.language,
            key: 'lang',
            onChange: handleLangChange,
        },
        {
            title: 'theme',
            icon: <SunOutlined />,
            type: 'switch' as const,
            checked: <SunOutlined />,
            unchecked: <MoonOutlined />,
            key: 'theme',
        },
    ], [handleLangChange])

    /** 设置面板内容 */
    const settingsContent = useMemo(() => settings.map((item) => (
        <div className='menu-setting-item' key={item.key}>
            <div className='setting-item-title'>
                {item.icon}
                <span>{$t(item.title)}</span>
            </div>
            {item.type === 'select' && (
                <Select
                    className='setting-option'
                    onChange={item.onChange}
                    options={item.options}
                    defaultValue={item.defaultValue}
                />
            )}
            {item.type === 'switch' && (
                <Switch
                    className='setting-option'
                    checkedChildren={item.checked}
                    unCheckedChildren={item.unchecked}
                    defaultChecked
                />
            )}
        </div>
    )), [settings])

    /** 当前激活的路径 */
    const activePath = useMemo(() => {
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
                            <Tooltip placement='right' title={$t(item.title)}>
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
                >
                    <Tooltip placement='right' title={$t('setting')}>
                        <SettingOutlined />
                    </Tooltip>
                </Button>
            </Popover>
        </div>
    )
}