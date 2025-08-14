import React, { useState, useRef, useEffect } from "react";
import type { ObjectItem } from "../App";

interface ViewportProps {
    items: ObjectItem[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}

const getTransform = (t: ObjectItem["transform"]) =>
    `translate3d(${t.translateX}px, ${t.translateY}px, ${t.translateZ}px) ` +
    `rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) ` +
    `scale3d(${t.scaleX}, ${t.scaleY}, ${t.scaleZ})`;

// Add onSelect to propagate click
const renderObject = (
    item: ObjectItem,
    selectedId?: string | null,
    onSelect?: (id: string) => void
): React.ReactNode => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelect)
            onSelect(item.id);
    };

    if (item.type === "container") {
        return (
            <div
                key={item.id}
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    translate: "-50% -50%",
                    width: item.style?.width,
                    height: item.style?.height,
                    transform: getTransform(item.transform),
                    transformStyle: "preserve-3d",
                    outline: item.id === selectedId ? "2px solid #3b82f6" : undefined,
                    boxShadow: item.id === selectedId ? "0 0 0 2px #3b82f6" : undefined,
                    zIndex: item.id === selectedId ? 2 : 1,
                    cursor: "pointer",
                    opacity: item?.style?.opacity,
                    borderRadius: typeof item?.style?.borderRadius === "number" ? `${item.style.borderRadius}%` : undefined,
                }}
                title={item.name}
                onClick={handleClick}
            >
                {item.children && item.children.map(child => renderObject(child, selectedId, onSelect))}
            </div>
        );
    }
    return (
        <div
            key={item.id}
            style={{
                width: item.style?.width,
                height: item.style?.height,
                backgroundColor: item.style?.backgroundColor,
                backgroundImage: item.background?.backgroundImage ? `url(${item.background.backgroundImage})` : undefined,
                backgroundSize: item.background?.backgroundSize,
                backgroundPosition: item.background?.backgroundPosition,
                position: "absolute",
                left: "50%",
                top: "50%",
                translate: "-50% -50%",
                transform: getTransform(item.transform),
                outline: item.id === selectedId ? "2px solid #3b82f6" : undefined,
                boxShadow: item.id === selectedId ? "0 0 0 2px #3b82f6" : undefined,
                zIndex: item.id === selectedId ? 2 : 1,
                cursor: "pointer",
                opacity: item?.style?.opacity,
                borderRadius: typeof item?.style?.borderRadius === "number" ? `${item.style?.borderRadius}%` : undefined,
            }}
            title={item.name}
            onClick={handleClick}
        />
    );
};

const Viewport: React.FC<ViewportProps> = ({ items, selectedId, onSelect }) => {
    // Load rotation from localStorage
    const [rotateX, setRotateX] = useState(() => {
        const v = localStorage.getItem("viewportRotateX");
        return v ? Number(v) : 0;
    });
    const [rotateY, setRotateY] = useState(() => {
        const v = localStorage.getItem("viewportRotateY");
        return v ? Number(v) : 0;
    });
    const [rotateZ, setRotateZ] = useState(() => {
        const v = localStorage.getItem("viewportRotateZ");
        return v ? Number(v) : 0;
    });


    const MAX_FOV = 50000;
    // Save rotation to localStorage when changed
    useEffect(() => {
        localStorage.setItem("viewportRotateX", String(rotateX));
    }, [rotateX]);
    useEffect(() => {
        localStorage.setItem("viewportRotateY", String(rotateY));
    }, [rotateY]);
    useEffect(() => {
        localStorage.setItem("viewportRotateZ", String(rotateZ));
    }, [rotateZ]);

    // Zoom state
    const [zoom, setZoom] = useState(() => {
        const v = localStorage.getItem("viewportZoom");
        return v ? Number(v) : 1;
    });

    // Save zoom to localStorage
    useEffect(() => {
        localStorage.setItem("viewportZoom", String(zoom));
    }, [zoom]);

    // Field of view state
    const [fov, setFov] = useState(() => {
        const v = localStorage.getItem("viewportFov");
        return v ? Number(v) : 600;
    });

    useEffect(() => {
        localStorage.setItem("viewportFov", String(fov));
    }, [fov]);

    // Keyboard handler for FOV
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
            if (e.key === "[") {
                setFov(f => Math.max(100, f - 50));
            } else if (e.key === "]") {
                setFov(f => Math.min(MAX_FOV, f + 50));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // For mouse drag rotation
    const dragging = useRef(false);
    const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastRotate = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 1) return; // Only middle mouse button
        e.preventDefault();
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        lastRotate.current = { x: rotateX, y: rotateY };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setRotateY(lastRotate.current.y + dx);
        setRotateX(lastRotate.current.x - dy);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button !== 1) return;
        dragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // Mouse wheel for zoom
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) return; // Let browser zoom if ctrl is pressed
        e.preventDefault();
        let nextZoom = zoom - e.deltaY * 0.001;
        nextZoom = Math.max(0.1, Math.min(5, nextZoom));
        setZoom(nextZoom);
    };

    return (
        <div
            className="relative w-full h-full"
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            style={{ cursor: dragging.current ? "grab" : "default" }}
        >
            <div className="absolute bottom-0 right-0 z-10 bg-neutral-800 bg-opacity-80 p-2 rounded flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs">
                    X
                    <input
                        type="range"
                        min={-180}
                        max={180}
                        value={rotateX}
                        onChange={e => setRotateX(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span>{rotateX}°</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                    Y
                    <input
                        type="range"
                        min={-180}
                        max={180}
                        value={rotateY}
                        onChange={e => setRotateY(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span>{rotateY}°</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                    Z
                    <input
                        type="range"
                        min={-180}
                        max={180}
                        value={rotateZ}
                        onChange={e => setRotateZ(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span>{rotateZ}°</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                    Zoom
                    <input
                        type="range"
                        min={0.1}
                        max={5}
                        step={0.01}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span>{zoom.toFixed(2)}x</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                    FOV
                    <input
                        type="range"
                        min={100}
                        max={MAX_FOV}
                        step={10}
                        value={fov}
                        onChange={e => setFov(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span>{fov}px</span>
                </label>
            </div>
            <div
                className="relative w-full h-full flex flex-col items-center justify-center transform-3d"
                id="viewport"
                style={{
                    perspective: `${fov}px`,
                    transform: `scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                    transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                }}
            >
                {items.map(item => renderObject(item, selectedId, onSelect))}
            </div>
        </div>
    );
};

export default Viewport;