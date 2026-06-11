import { Button, Tooltip } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PictureOutlined, AppstoreOutlined } from '@ant-design/icons'
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

export default function MenuBar() {
    const navigate = useNavigate()
    const location = useLocation()

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
        </div>
    )
}