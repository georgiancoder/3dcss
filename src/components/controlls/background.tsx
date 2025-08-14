import type {ObjectItem} from "../../App.tsx";
import React, {useEffect, useRef} from "react";

interface BackgroundControllsProps {
    item: ObjectItem;
    onChange?: (transform: ObjectItem["background"], id: string) => void;
}

const BackgroundControlls: React.FC<BackgroundControllsProps> = ({ item, onChange }) => {
    const [backgroundImg, setBackgroundImage] = React.useState<string>(item.background?.backgroundImage || "");
    const [backgroundSize, setBackgroundSize] = React.useState<string>(item.background?.backgroundSize || "cover");
    const [backgroundPosition, setBackgroundPosition] = React.useState<string>(item.background?.backgroundPosition || "center");

    const prevBackgroundRef = useRef(item.background);
    const prevIdRef = useRef(item.id);

    useEffect(() => {
        const prev = prevBackgroundRef.current;

        const hasChanged =
            prev?.backgroundImage !== backgroundImg ||
            prev?.backgroundSize !== backgroundSize ||
            prev?.backgroundPosition !== backgroundPosition;

        if (onChange && hasChanged) {
            onChange({
                backgroundImage: backgroundImg,
                backgroundSize,
                backgroundPosition
            }, item.id);
        }

    }, [backgroundImg, backgroundSize, backgroundPosition, onChange]);

    useEffect(() => {
        if(item.id !== prevIdRef?.current) {
            setBackgroundImage(item.background?.backgroundImage || "");
            setBackgroundSize(item.background?.backgroundSize || "cover");
            setBackgroundPosition(item.background?.backgroundPosition || "center");
            prevIdRef.current = item.id;
        }
    }, [prevIdRef, item]);

    return (<>
        <h3 className="text-neutral-400 text-sm font-medium">Background Styles</h3>

        <form className="flex flex-col gap-4 mt-3">
            <div className="flex gap-4">
                <label className="flex flex-col text-xs text-gray-300 flex-1 w-[calc(50%-10px)]">
                    Background Image Url
                    <input
                        type="text"
                        min={1}
                        value={backgroundImg}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        onPaste={(e) => setBackgroundImage(e.clipboardData?.getData('text'))}
                        className="mt-1 rounded-md px-3 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
            </div>
            {backgroundImg && (
                <div className="flex gap-4">
                    <label className="flex flex-col text-xs text-gray-300 flex-1 w-[calc(50%-10px)]">
                        Bg Size
                        <select
                            value={backgroundSize}
                            onChange={(e) => setBackgroundSize(e.target.value)}
                            className="mt-1 rounded-md px-3 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                        </select>
                    </label>
                    <label className="flex flex-col text-xs text-gray-300 flex-1 w-[calc(50%-10px)]">
                        Bg Position
                        <select
                            value={backgroundPosition}
                            onChange={(e) => setBackgroundPosition(e.target.value)}
                            className="mt-1 rounded-md px-3 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                        </select>
                    </label>
                </div>
                )}
        </form>
        </>)
}

export default BackgroundControlls;