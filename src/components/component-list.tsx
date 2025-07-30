import React from "react";
import type { ObjectItem } from "../App";

interface ComponentListProps {
    items: ObjectItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({ items, selectedId, onSelect, onDelete }) => {
    return (
        <ul className="mt-3 space-y-2">
            {items.length === 0 && (
                <li className="text-neutral-400 text-sm">No objects yet.</li>
            )}
            {items.map(item => (
                <li
                    key={item.id}
                    className={`bg-neutral-700 p-2 rounded flex items-center justify-between cursor-pointer hover:bg-neutral-600 transition-colors ${
                        selectedId === item.id ? "bg-neutral-900" : ""
                    }`}
                    onClick={() => onSelect(item.id)}
                >
                    <span className="flex-1">{item.name}</span>
                    <button
                        className="ml-2 text-red-400 hover:text-red-600 px-2 py-0.5 rounded"
                        onClick={e => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        title="Delete"
                    >
                        ×
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ComponentList;