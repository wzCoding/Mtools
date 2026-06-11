import { useState, useCallback, useRef } from "react";
import type { Position, ContextMenuProps } from "@/type/index";

export function useContextMenu(): ContextMenuProps {
    const [show, setShow] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const onOpen: (e: React.MouseEvent) => void = useCallback((e: React.MouseEvent) => {
        e.preventDefault(); // 阻止浏览器原生右键菜单
        setPosition({ x: e.clientX, y: e.clientY });
        setShow(true);
    }, []);

    const onClose = useCallback(() => {
        console.log('close')
        setShow(false);
    }, []);

    return {
        show,
        x: position.x,
        y: position.y,
        onOpen,
        onClose,
        menuRef: menuRef as React.RefObject<HTMLDivElement>,
    };
}