import React, { useState } from "react";

interface AddNewItemProps {
    open: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; width: number; height: number; color: string }) => void;
}

const AddNewItem: React.FC<AddNewItemProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState("");
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [color, setColor] = useState("#3498db");

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, width, height, color });
        setName("");
        setWidth(100);
        setHeight(100);
        setColor("#3498db");
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-neutral-800 text-white rounded-xl shadow-2xl p-6 w-[320px] relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4">Add New Object</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Box 1"
                        />
                    </div>

                    {/* Width & Height */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-300 mb-1">Width</label>
                            <input
                                type="number"
                                min={1}
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                required
                                className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-300 mb-1">Height</label>
                            <input
                                type="number"
                                min={1}
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                required
                                className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Color</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-md text-white font-medium"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>

    );
};

export default AddNewItem;