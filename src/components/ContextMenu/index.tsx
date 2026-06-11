import { useLayoutEffect } from "react";
import CardPanel from "../CardPanel";
import { computedPosition } from "@/utils";
import type { ContextMenuProps } from "@/type/index";
import './index.less'

export default function ContextMenu({ show, onClose, x, y, menuRef, children, id, style }: ContextMenuProps) {

    useLayoutEffect(() => {
        if (show && menuRef.current) {
            const { x: left, y: top } = computedPosition(menuRef.current, x, y);
            menuRef.current.style.left = `${left}px`;
            menuRef.current.style.top = `${top}px`;
            menuRef.current.style.opacity = '1';
            menuRef.current.style.transform = 'translate(0,0)';
        }
    }, [show, x, y, menuRef]);

    useLayoutEffect(() => {
        if (!show) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [show, onClose, menuRef]);

    if (!show) return null;

    return (
        <CardPanel id={id} className="context-menu" ref={menuRef} style={style }>
            {children}
        </CardPanel>
    );
}