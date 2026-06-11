import './index.less'

import React from 'react';
import { Input } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

interface HeaderBarProps {
    className?: string,
    onSearch: (value: string) => void,
    children?: React.ReactNode
}

function HeaderBar({ className, onSearch, children }: HeaderBarProps) {
    const { Search } = Input
    return (
        <div className={`${className} header-bar`}>
            <Search className='header-search-input' prefix={<FileSearchOutlined />} placeholder="Search..." allowClear onSearch={onSearch} />
            {children ? children : null}
        </div>
    )
}

export default React.memo(HeaderBar)