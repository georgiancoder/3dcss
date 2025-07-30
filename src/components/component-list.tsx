import React from "react";
import type { ObjectItem } from "../App";

interface ComponentListProps {
    items: ObjectItem[];
}

const ComponentList: React.FC<ComponentListProps> = ({ items }) => {
    return (
        <ul className="mt-3 space-y-2">
            {items.length === 0 && (
                <li className="text-neutral-400 text-sm">No objects yet.</li>
            )}
            {items.map(item => (
                <li key={item.id} className="bg-neutral-700 p-2 rounded cursor-pointer hover:bg-neutral-600 transition-colors">
                    {item.name}
                </li>
            ))}
        </ul>
    );
}

export default ComponentList;