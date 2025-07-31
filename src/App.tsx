import './App.css'
import ComponentList from "./components/component-list.tsx";
import AddNewItem from "./components/add-new-item.tsx";
import { useState, useEffect } from "react";
import Viewport from "./components/viewport.tsx";
import BasicControlls from "./components/controlls/basic.tsx";
import TransformControls from "./components/controlls/transforms.tsx";
import OverlayMenu from "./components/overlay-menu.tsx";

// Extend ObjectItem to support children and type
export interface ObjectItem {
  id: string;
  name: string;
  type?: "object" | "container";
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
    opacity?: number;
    borderRadius?: number;
  };
  children?: ObjectItem[];
  parentId?: string | null;
}

// Add ModalOpenType
type ModalOpenType =
  | false
  | "container"
  | { type: "object"; parentId: string };

function App() {
  // Use ModalOpenType for modalOpen
  const [modalOpen, setModalOpen] = useState<ModalOpenType>(false);
  const [items, setItems] = useState<ObjectItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("objects") || "[]");
    setItems(stored);
    if (stored.length > 0) {
      setSelectedId(stored[stored.length - 1].id);
    }
  }, []);

  const handleAddObject = () => {
    setModalOpen(true as ModalOpenType); // for backward compatibility, but you may want to use { type: "object" } instead
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddNewItem = (data: { name: string; width: number; height: number; color: string; type?: "object" | "container"; parentId?: string | null }) => {
    const itemsFromStorage: ObjectItem[] = JSON.parse(localStorage.getItem("objects") || "[]");
    const newId = `obj_${Date.now()}`;
    const newItem: ObjectItem = {
      id: newId,
      name: data.name,
      type: data.type || "object",
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
        backgroundColor: data.color,
        opacity: 1,
        borderRadius: 0
      },
      parentId: data.parentId || null,
      children: data.type === "container" ? [] : undefined
    };

    let updatedItems: ObjectItem[];
    if (data.parentId) {
      // Add as child to parent
      updatedItems = itemsFromStorage.map(item =>
        item.id === data.parentId && item.type === "container"
          ? { ...item, children: [...(item.children || []), newItem] }
          : item
      );
    } else {
      updatedItems = [...itemsFromStorage, newItem];
    }

    localStorage.setItem("objects", JSON.stringify(updatedItems));
    setItems(updatedItems);
    setSelectedId(newId);
    setModalOpen(false);
  };

  const findItemById = (items: ObjectItem[], searchId: string): ObjectItem | null => {
        for (const item of items) {
            if (item.id === searchId) return item;
            if (item.children) {
                const found = findItemById(item.children, searchId);
                if (found) return found;
            }
        }
        return null;
  };

  const handleSelect = (id: string) => {
      const found = findItemById(items, id);
      setSelectedId(found ? found.id : null);
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


    // Update: set type for newProps
    const updateItemById = (
        items: ObjectItem[],
        id: string,
        newProps: Partial<ObjectItem>
    ): ObjectItem[] =>
        items.map(item =>
            item.id === id
                ? { ...item, ...newProps }
                : item.children
                    ? { ...item, children: updateItemById(item.children, id, newProps) }
                    : item
        );

  // Add this handler to update transforms
    const handleTransformChange = (newTransform: ObjectItem["transform"], id: string) => {
        const currentItem = findItemById(items, id);
        if (!currentItem || JSON.stringify(currentItem.transform) === JSON.stringify(newTransform)) return;


        const updatedItems = updateItemById(items, id, {transform: newTransform});
        setItems(updatedItems);
        localStorage.setItem("objects", JSON.stringify(updatedItems));
    };

    const hanldeStyleChange = (newStyle: ObjectItem["style"], id: string) => {
        const currentItem = findItemById(items, id);
        if (!currentItem || JSON.stringify(currentItem.style) === JSON.stringify(newStyle)) return;

        const updatedItems = updateItemById(items, id, {style: {
          ...currentItem.style,
          ...newStyle
        }});
        setItems(updatedItems);
        localStorage.setItem("objects", JSON.stringify(updatedItems));
    }

  const handleCloneItem = (id: string) => {
    const findAndClone = (item: ObjectItem): ObjectItem => {
      const newId = `obj_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      return {
        ...item,
        id: newId,
        name: item.name + " (clone)",
        children: item.children ? item.children.map(findAndClone) : undefined
      };
    };

    let updatedItems: ObjectItem[] = [];
    const itemsFromStorage: ObjectItem[] = JSON.parse(localStorage.getItem("objects") || "[]");

    const cloneAndInsert = (items: ObjectItem[]): ObjectItem[] => {
      return items.flatMap(item => {
        if (item.id === id) {
          const clone = findAndClone(item);
          return [item, clone];
        }
        if (item.children) {
          return [{ ...item, children: cloneAndInsert(item.children) }];
        }
        return [item];
      });
    };

    updatedItems = cloneAndInsert(itemsFromStorage);
    localStorage.setItem("objects", JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

    const activeItem = findItemById(items, selectedId || "") || null;

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
                <img src="/logo.webp" className="w-20" alt="logo"/>
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
                <button
                    className="bg-green-500 py-1 rounded hover:bg-green-600 cursor-pointer mt-2"
                    onClick={() => setModalOpen("container")}
                >
                    + Add Empty Container
                </button>
                <div className="overflow-y-auto no-scrollbar flex-1">
                    <ComponentList
                        items={items}
                        selectedId={selectedId}
                        onSelect={handleSelect}
                        onDelete={handleDeleteItem}
                        onClone={handleCloneItem}
                        onAddSubObject={(parentId) => setModalOpen({ type: "object", parentId })}
                    />
                </div>
            </aside>

            {/* PREVIEW AREA */}
            <main
                className="bg-neutral-700 flex items-center justify-center perspective-[100vw] overflow-hidden viewport-3d relative"
                style={{ gridArea: "preview" }}
            >
                {/* Arrow button */}
                <button
                    className="absolute top-2 right-2 z-20 bg-blue-500 text-white rounded-full p-2 shadow hover:bg-blue-600"
                    style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setOverlayOpen(true)}
                    title="Show Overlay"
                >
                    {/* Left-pointing arrow */}
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M13 5l-5 5 5 5" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                {/* Overlay */}
                {overlayOpen && (
                    <OverlayMenu onClose={() => setOverlayOpen(false)} />
                )}
                <Viewport items={items} selectedId={selectedId} onSelect={handleSelect} />
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
                            <div className="h-0.5 bg-neutral-700"></div>
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
                addvertising place
            </footer>
        </div>
        <AddNewItem
            open={!!modalOpen}
            onClose={handleCloseModal}
            onAdd={(data) => {
              if (typeof modalOpen === "object" && modalOpen.parentId) {
                handleAddNewItem({ ...data, parentId: modalOpen.parentId });
              } else if (modalOpen === "container") {
                handleAddNewItem({ ...data, type: "container" });
              } else {
                handleAddNewItem(data);
              }
            }}
            type={modalOpen === "container" ? "container" : "object"}
        />
    </>
  )
}

export default App
