import React from "react";

const OverlayMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const handleCopy = () => {
        const viewportDiv = document.getElementById("viewport");
        if (viewportDiv) {
            const clone = viewportDiv.cloneNode(true) as HTMLElement;
            const removeClasses = (el: Element) => {
                el.removeAttribute("class");
                Array.from(el.children).forEach(removeClasses);
            };
            removeClasses(clone);
            clone.style.perspective = "2500vw";
            clone.style.width = "100dvw";
            clone.style.height = "100dvh";
            clone.style.transformStyle = "preserve-3d";
            navigator.clipboard.writeText(clone.outerHTML);
        }
    };

    return (
        <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
        >
            {/* Close button at top right */}
            <button
                className="absolute top-4 right-4 z-40 bg-white text-black rounded-full p-2 shadow hover:bg-gray-200"
                onClick={onClose}
                title="Close"
            >
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <line x1="5" y1="5" x2="15" y2="15" stroke="black" strokeWidth="2"/>
                    <line x1="15" y1="5" x2="5" y2="15" stroke="black" strokeWidth="2"/>
                </svg>
            </button>
            {/* Copy HTML code button */}
            <button
                className="absolute top-4 right-16 z-40 bg-green-500 text-white rounded-full p-2 shadow hover:bg-green-600 cursor-pointer"
                onClick={handleCopy}
                title="Copy Viewport HTML"
            >
                copy
            </button>
        </div>
    );
};
export default OverlayMenu;