import React, { useState, useEffect } from "react";
import type { ObjectItem } from "../App";

interface ComponentListProps {
    items: ObjectItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onClone?: (id: string) => void;
    onAddSubObject?: (parentId: string) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({
    items,
    selectedId,
    onSelect,
    onDelete,
    onClone,
    onAddSubObject
}) => {
    // Load collapsed state from localStorage or default to collapsed
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
        try {
            const stored = localStorage.getItem("collapsedContainers");
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    // Collapse containers by default when items change (first load only)
    useEffect(() => {
        if (Object.keys(collapsed).length === 0) {
            const newCollapsed: Record<string, boolean> = {};
            const markContainers = (objs: ObjectItem[]) => {
                objs.forEach(obj => {
                    if (obj.type === "container") {
                        newCollapsed[obj.id] = true;
                    }
                    if (obj.children && obj.children.length > 0) {
                        markContainers(obj.children);
                    }
                });
            };
            markContainers(items);
            setCollapsed(newCollapsed);
            localStorage.setItem("collapsedContainers", JSON.stringify(newCollapsed));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    // Save collapsed state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("collapsedContainers", JSON.stringify(collapsed));
    }, [collapsed]);

    const handleToggle = (id: string) => {
        setCollapsed(prev => {
            const updated = {
                ...prev,
                [id]: !prev[id]
            };
            localStorage.setItem("collapsedContainers", JSON.stringify(updated));
            return updated;
        });
    };

    // Recursive render function with collapse support
    const renderItem = (
        item: ObjectItem,
        level: number = 0
    ) => (
        <li
            key={item.id}
            className={`bg-neutral-700 p-2 rounded flex flex-wrap items-center justify-between cursor-pointer hover:bg-neutral-600 transition-colors mt-1 ml-${level * 4} ${selectedId === item.id ? "bg-neutral-900" : ""}`}
            style={{ marginLeft: level * 16 }}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
        >
            <span className="flex-1 flex items-center gap-1">
                {item.type === "container" && (
                    <button
                        className="text-xs text-gray-400 hover:text-white mr-1"
                        style={{ width: 18 }}
                        onClick={e => {
                            e.stopPropagation();
                            handleToggle(item.id);
                        }}
                        title={collapsed[item.id] ? "Expand" : "Collapse"}
                        tabIndex={-1}
                    >
                        {collapsed[item.id] ? "▶" : "▼"}
                    </button>
                )}
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
            {/* Render children recursively, with collapse/expand */}
            {item.children && item.children.length > 0 && !collapsed[item.id] && (
                <ul className="ml-4 mt-1 w-full">
                    {item.children.map(child =>
                        renderItem(child, level + 1)
                    )}
                </ul>
            )}
        </li>
    );

    return (
        <ul className="mt-3 space-y-2">
            {items.length === 0 && (
                <li className="text-neutral-400 text-sm">No objects yet.</li>
            )}
            {items.map(item =>
                renderItem(item)
            )}
        </ul>
    );
};

export default ComponentList;