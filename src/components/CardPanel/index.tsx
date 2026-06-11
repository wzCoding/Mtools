import React from 'react';
import './index.less'

interface CardPanelProps {
    title?: string;
    content?: string | React.ReactNode;
    style?: React.CSSProperties;
    id?: string,
    className?: string;
    ref?: React.RefObject<HTMLDivElement | null>
    children?: string | React.ReactNode;
}

function CardPanel({ id = '',className='', title = '', content = '', style = {}, ref, children }: CardPanelProps) {
    const cardContent = content || children;
    return (
        <div className={`card-panel ${className}`} style={style} ref={ref} id={id ? id : undefined}>
            {title ? <div className='card-header'>{title}</div> : null}
            {cardContent ? <div className='card-content'>{cardContent}</div> : null}
        </div >
    )
}

export default React.memo(CardPanel)