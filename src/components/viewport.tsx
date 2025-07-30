import React from "react";
import type { ObjectItem } from "../App";

interface ViewportProps {
    items: ObjectItem[];
}

const getTransform = (t: ObjectItem["transform"]) =>
    `translate3d(${t.translateX}px, ${t.translateY}px, ${t.translateZ}px) ` +
    `rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) ` +
    `scale3d(${t.scaleX}, ${t.scaleY}, ${t.scaleZ})`;

const Viewport: React.FC<ViewportProps> = ({ items }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
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
    );
};

export default Viewport;