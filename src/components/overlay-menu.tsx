import React, { useRef } from "react";
import type {ObjectItem} from "../App.tsx";

const OverlayMenu: React.FC<{ onClose: () => void; onImport: (data: ObjectItem[]) => void }> = ({ onClose, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const handleExportJson = () => {
        const data = JSON.parse(localStorage.getItem("objects") || "[]");
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "objects.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(String(reader.result));
                if (Array.isArray(json)) {
                    onImport(json);
                }
            } catch {
                // silently ignore invalid JSON
            } finally {
                e.target.value = "";
            }
        };
        reader.readAsText(file);
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
            <div className="flex flex-col justify-start w-full h-full items-end px-14 py-12 gap-2">
                {/* Copy HTML code button */}
                <button
                    className=" bg-green-500 text-white rounded-full px-3 py-2 shadow hover:bg-green-600 cursor-pointer text-sm"
                    onClick={handleCopy}
                    title="Copy Viewport HTML"
                >
                    Copy HTML
                </button>
                {/* Export JSON button */}
                <button
                    className="bg-indigo-500 text-white rounded-full px-3 py-2 shadow hover:bg-indigo-600 cursor-pointer text-sm"
                    onClick={handleExportJson}
                    title="Export JSON"
                >
                    Export JSON
                </button>
                {/* Import JSON button */}
                <button
                    className="bg-yellow-500 text-white rounded-full px-3 py-2 shadow hover:bg-yellow-600 cursor-pointer text-sm"
                    onClick={handleImportClick}
                    title="Import JSON"
                >
                    Import JSON
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
export default OverlayMenu;