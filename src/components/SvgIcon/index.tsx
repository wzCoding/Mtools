import { useMemo } from 'react'
import './index.less'

export interface SvgIconProps {
    name: string
    size?: number
    color?: string
    className?: string;
    prefix?: string;
    style?: React.CSSProperties;
}

const SvgIcon = ({ name, size = 18, color = 'currentColor', className, prefix = 'icon', style = {} }: SvgIconProps) => {
    const svgClassName = className ? `svg-icon ${className}` : 'svg-icon';
    const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name]);
    const svgStyle = {
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color: color,
        ...style
    };
    return (
        <svg
            className={svgClassName}
            style={svgStyle}
            aria-hidden="true"
        >
            <use href={symbolId} fill={color} />
        </svg>
    );
}

export default SvgIcon;