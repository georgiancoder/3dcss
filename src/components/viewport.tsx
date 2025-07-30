import React, { useState } from "react";
import type { ObjectItem } from "../App";

interface ViewportProps {
    items: ObjectItem[];
}

const getTransform = (t: ObjectItem["transform"]) =>
    `translate3d(${t.translateX}px, ${t.translateY}px, ${t.translateZ}px) ` +
    `rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) ` +
    `scale3d(${t.scaleX}, ${t.scaleY}, ${t.scaleZ})`;

const Viewport: React.FC<ViewportProps> = ({ items }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [rotateZ, setRotateZ] = useState(0);

    return (
        <div className="relative w-full h-full">
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
            </div>
            <div className="relative w-full h-full flex flex-col items-center justify-center transform-3d"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                    transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                }}
            >
                {items.map(item => (
                    <div
                        key={item.id}
                        style={{
                            width: item.style.width,
                            height: item.style.height,
                            backgroundColor: item.style.backgroundColor,
                            transform: getTransform(item.transform),
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            translate: "-50% -50%",
                        }}
                        title={item.name}
                    />
                ))}

            </div>
        </div>
    );
};

export default Viewport;