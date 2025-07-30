import './App.css'
import ComponentList from "./components/component-list.tsx";
import AddNewItem from "./components/add-new-item.tsx";
import { useState, useEffect } from "react";
import Viewport from "./components/viewport.tsx";
import BasicControlls from "./components/controlls/basic.tsx";
import TransformControls from "./components/controlls/transforms.tsx";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("objects") || "[]");
    setItems(stored);
    if (stored.length > 0) {
      setSelectedId(stored[stored.length - 1].id);
    }
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
    setSelectedId(newId);
    setModalOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem("objects", JSON.stringify(updatedItems));
    setItems(updatedItems);
    // If the deleted item was selected, select the last item or null
    if (selectedId === id) {
      setSelectedId(updatedItems.length > 0 ? updatedItems[updatedItems.length - 1].id : null);
    }
  };

  // Add this handler to update transforms
    const handleTransformChange = (newTransform: ObjectItem["transform"], id: string) => {
        const currentItem = items.find(item => item.id === id);
        if (!currentItem || JSON.stringify(currentItem.transform) === JSON.stringify(newTransform)) return;

        const updatedItems = items.map(item =>
            item.id === id ? { ...item, transform: newTransform } : item
        );
        setItems(updatedItems);
        localStorage.setItem("objects", JSON.stringify(updatedItems));
    };

    const hanldeStyleChange = (newStyle: ObjectItem["style"], id: string) => {
        const currentItem = items.find(item => item.id === id);
        if (!currentItem || JSON.stringify(currentItem.style) === JSON.stringify(newStyle)) return;

        const updatedItems = items.map(item =>
            item.id === id ? { ...item, style: newStyle } : item
        );
        setItems(updatedItems);
        localStorage.setItem("objects", JSON.stringify(updatedItems));
    }

  const activeItem = items.find(item => item.id === selectedId) || null;

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
                    <ComponentList
                        items={items}
                        selectedId={selectedId}
                        onSelect={handleSelect}
                        onDelete={handleDeleteItem}
                    />
                </div>
            </aside>

            {/* PREVIEW AREA */}
            <main
                className="bg-neutral-700 flex items-center justify-center perspective-[100vw] overflow-hidden viewport-3d"
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
                    {selectedId && activeItem && (
                        <>
                            <BasicControlls
                                item={activeItem}
                                onChange={(newStyle, id) => hanldeStyleChange(newStyle, id)
                                }
                            />
                            <TransformControls
                                item={activeItem}
                                onChange={(newTransform, id) => handleTransformChange(newTransform, id)}
                            />
                        </>
                    )}
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
