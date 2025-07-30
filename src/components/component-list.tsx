import React from "react";
import type { ObjectItem } from "../App";

interface ComponentListProps {
    items: ObjectItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onClone?: (id: string) => void;
    onAddSubObject?: (parentId: string) => void;
}

const renderItem = (
    item: ObjectItem,
    selectedId: string | null,
    onSelect: (id: string) => void,
    onDelete: (id: string) => void,
    onClone?: (id: string) => void,
    onAddSubObject?: (parentId: string) => void,
    level: number = 0
) => (
    <li
        key={item.id}
        className={`bg-neutral-700 p-2 rounded flex flex-wrap items-center justify-between cursor-pointer hover:bg-neutral-600 transition-colors mt-1 ml-${level * 4} ${selectedId === item.id ? "bg-neutral-900" : ""}`}
        style={{ marginLeft: level * 16 }}
        onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
    >
        <span className="flex-1">
            {item.type === "container" ? "🗂️ " : ""}
            {item.name}
        </span>
        <div className="flex gap-1">
            {item.type === "container" && onAddSubObject && (
                <button
                    className="text-green-400 hover:text-green-600 px-2 py-0.5 rounded"
                    onClick={e => {
                        e.stopPropagation();
                        onAddSubObject(item.id);
                    }}
                    title="Add Sub Object"
                >
                    +
                </button>
            )}
            {onClone && (
                <button
                    className="text-blue-400 hover:text-blue-600 px-2 py-0.5 rounded"
                    onClick={e => {
                        e.stopPropagation();
                        onClone(item.id);
                    }}
                    title="Clone"
                >
                    ⧉
                </button>
            )}
            <button
                className="text-red-400 hover:text-red-600 px-2 py-0.5 rounded"
                onClick={e => {
                    e.stopPropagation();
                    onDelete(item.id);
                }}
                title="Delete"
            >
                ×
            </button>
        </div>
        {/* Render children recursively */}
        {item.children && item.children.length > 0 && (
            <ul className="ml-4 mt-1 w-full">
                {item.children.map(child =>
                    renderItem(child, selectedId, onSelect, onDelete, onClone, onAddSubObject, level + 1)
                )}
            </ul>
        )}
    </li>
);

const ComponentList: React.FC<ComponentListProps> = ({
    items,
    selectedId,
    onSelect,
    onDelete,
    onClone,
    onAddSubObject
}) => {
    return (
        <ul className="mt-3 space-y-2">
            {items.length === 0 && (
                <li className="text-neutral-400 text-sm">No objects yet.</li>
            )}
            {items.map(item =>
                renderItem(item, selectedId, onSelect, onDelete, onClone, onAddSubObject)
            )}
        </ul>
    );
};

export default ComponentList;