import { Tooltip, Modal, Select, Segmented } from 'antd'
import React, { useMemo, useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PictureOutlined, AppstoreOutlined, SettingOutlined, TranslationOutlined, SunOutlined, MoonOutlined, AimOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme, type Theme } from '@/hooks/useTheme'
import i18n from '@/i18n'
import './index.less'

interface MenuItem {
    title: string,
    icon: React.ReactNode,
    path?: string
}

const menus: MenuItem[] = [
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
    {
        title:'screenshot',
        icon:<AimOutlined/>,
        path:'/screenshot'
    },
    {
        title: 'setting',
        icon: <SettingOutlined />,
    },
]

export default function MenuBar() {
    const navigate = useNavigate()
    const location = useLocation()

    const { t: $t } = useTranslation()
    const { theme, setTheme } = useTheme()

    /** 切换语言 */
    const handleLangChange = useCallback((value: string) => {
        i18n.changeLanguage(value)
        window.bridgeApis?.changeLanguage(value)
    }, [])

    /** 切换主题 */
    const handleThemeChange = useCallback((value: string | number) => {
        setTheme((value === 'dark' ? 'dark' : 'light') as Theme)
    }, [setTheme])

    const settings = useMemo(() => [
        {
            title: 'language',
            icon: <TranslationOutlined />,
            type: 'select' as const,
            options: [
                { value: 'zh', label: $t('chinese') },
                { value: 'en', label: $t('english') },
            ],
            key: 'lang',
            onChange: handleLangChange,
        },
        {
            title: 'theme',
            icon: <SunOutlined />,
            type: 'Segmented' as const,
            options: [
                { value: 'light', label: $t('light'), icon: <SunOutlined /> },
                { value: 'dark', label: $t('dark'), icon: <MoonOutlined /> },
            ],
            key: 'theme',
            onChange: handleThemeChange,
            value: theme,
        },
    ], [handleLangChange, handleThemeChange, theme, i18n.language])

    const settingsContent = useMemo(() => settings.map((item) => (
        <div className='menu-setting-item' key={item.key}>
            <div className='setting-item-title'>
                {item.icon}
                <span>{$t(item.title)}</span>
            </div>
            {item.type === 'select' && (
                <Select
                    className='setting-option select'
                    onChange={item.onChange}
                    options={item.options}
                    value={i18n.language}
                />
            )}
            {item.type === 'Segmented' && (
                <Segmented
                    className='setting-option segmented'
                    options={item.options}
                    value={item.value}
                    onChange={item.onChange}
                />
            )}
        </div>)
    ), [settings, theme, i18n.language])

    const [showModal, setShowModal] = useState<boolean>(false)

    const activePath = useMemo(() => {
        const matched = menus.find((m) => m.path && location.pathname.startsWith(m.path))
        return matched?.path ?? ''
    }, [location.pathname])

    const handleMenuClick = (item: MenuItem) => {
        if (item.path) {
            navigate(item.path)
        } else {
            setShowModal(true)
        }
    }

    return (
        <div className="menu-bar">
            {
                menus.map(item => {
                    const isActive = activePath === item.path

                    return (
                        <div
                            key={item.title}
                            className={`menu-item${isActive ? ' menu-item--active' : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <Tooltip placement='right' title={$t(item.title)}>
                                {item.icon}
                            </Tooltip>
                        </div>
                    )
                })
            }
            <Modal open={showModal} title={$t('setting')} footer={null} onCancel={() => setShowModal(false)}>
                {settingsContent}
            </Modal>
        </div>
    )
}