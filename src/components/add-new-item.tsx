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
            className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-lg font-semibold mb-4 text-black">Add New Item</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full border rounded px-2 py-1 text-black"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                            <input
                                type="number"
                                value={width}
                                min={1}
                                onChange={e => setWidth(Number(e.target.value))}
                                required
                                className="w-full border rounded px-2 py-1 text-black"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                            <input
                                type="number"
                                value={height}
                                min={1}
                                onChange={e => setHeight(Number(e.target.value))}
                                required
                                className="w-full border rounded px-2 py-1 text-black"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className="w-10 h-10 p-0 border-0 bg-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNewItem;