import './App.css'
import ComponentList from "./components/component-list.tsx";
import AddNewItem from "./components/add-new-item.tsx";
import { useState, useEffect } from "react";
import Viewport from "./components/viewport.tsx";

// Define the type for an item
export interface ObjectItem {
  id: string;
  name: string;
  transform: {
    translateX: number;
    translateY: number;
    translateZ: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
  };
  style: {
    width: number;
    height: number;
    backgroundColor: string;
  };
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<ObjectItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("objects") || "[]");
    setItems(stored);
  }, []);

  const handleAddObject = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddNewItem = (data: { name: string; width: number; height: number; color: string }) => {
    const itemsFromStorage: ObjectItem[] = JSON.parse(localStorage.getItem("objects") || "[]");
    const newId = `obj_${itemsFromStorage.length + 1}`;
    const newItem: ObjectItem = {
      id: newId,
      name: data.name,
      transform: {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1
      },
      style: {
        width: data.width,
        height: data.height,
        backgroundColor: data.color
      }
    };
    const updatedItems = [...itemsFromStorage, newItem];
    localStorage.setItem("objects", JSON.stringify(updatedItems));
    setItems(updatedItems);
    setModalOpen(false);
  };

  return (
    <>
        <div
            className="h-screen text-white bg-neutral-900 grid gap-1"
            style={{
                gridTemplateAreas: `
          "header header header"
          "objects preview controls"
          "objects preview controls"
          "export export export"
        `,
                gridTemplateColumns: "250px 1fr 250px",
                gridTemplateRows: "60px 1fr 1fr 100px"
            }}
        >
            {/* HEADER */}
            <header
                className="bg-neutral-800 flex items-center px-4 text-lg font-bold"
                style={{ gridArea: "header" }}
            >
                <img src="/public/logo.webp" className="w-20" alt="logo"/>
            </header>

            {/* OBJECTS SIDEBAR */}
            <aside
                className="bg-neutral-800 p-3 flex flex-col"
                style={{ gridArea: "objects" }}
            >
                <button
                    className="bg-blue-500 py-1 rounded hover:bg-blue-600 cursor-pointer"
                    onClick={handleAddObject}
                >
                    + Add Object
                </button>
                <div className="overflow-y-auto no-scrollbar flex-1">
                    <ComponentList items={items}/>
                </div>
            </aside>

            {/* PREVIEW AREA */}
            <main
                className="bg-neutral-700 flex items-center justify-center perspective-1000 overflow-hidden viewport-3d"
                style={{ gridArea: "preview" }}
            >
                <Viewport items={items}/>
            </main>

            {/* CONTROLS PANEL */}
            <aside
                className="bg-neutral-800 p-3 space-y-3"
                style={{ gridArea: "controls" }}
            >
                <h3 className="font-semibold">Controls</h3>
                <div className="overflow-y-auto no-scrollbar flex-1 space-y-2">
                    <div>
                        <label className="block text-sm mb-1">Translate X</label>
                        <input type="range" min="-100" max="100" className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Rotate Y</label>
                        <input type="range" min="-180" max="180" className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Scale</label>
                        <input type="range" min="0.1" max="3" step="0.1" className="w-full" />
                    </div>
                </div>
            </aside>

            {/* EXPORT CSS BAR */}
            <footer
                className="bg-neutral-800 p-3 flex items-center justify-between"
                style={{ gridArea: "export" }}
            >
                <code className="text-green-400">
                    transform: rotateX(45deg) translateZ(50px);
                </code>
                <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
                    Copy
                </button>
            </footer>
        </div>
        <AddNewItem
            open={modalOpen}
            onClose={handleCloseModal}
            onAdd={handleAddNewItem}
        />
    </>
  )
}

export default App
