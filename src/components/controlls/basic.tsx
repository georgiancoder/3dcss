import React, { useState } from "react";

const BasicControlls = () => {
    const [width, setWidth] = useState<number>(100);
    const [height, setHeight] = useState<number>(100);
    const [color, setColor] = useState<string>("#ff0000");

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(Number(e.target.value));
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(Number(e.target.value));
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    return (
        <>
            <h3 className="text-neutral-400 text-sm font-medium">Basic Styles</h3>

            <form className="flex flex-col gap-4 mt-3">
                {/* Width & Height side by side */}
                <div className="flex gap-4">
                    <label className="flex flex-col text-xs text-gray-300 flex-1 w-[calc(50%-10px)]">
                        Width
                        <input
                            type="number"
                            min={1}
                            value={width}
                            onChange={handleWidthChange}
                            className="mt-1 rounded-md px-3 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex flex-col text-xs text-gray-300 flex-1 w-[calc(50%-10px)]">
                        Height
                        <input
                            type="number"
                            min={1}
                            value={height}
                            onChange={handleHeightChange}
                            className="mt-1 rounded-md px-3 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                {/* Color */}
                <label className="flex flex-col text-xs text-gray-300">
                    Color
                    <input
                        type="color"
                        value={color}
                        onChange={handleColorChange}
                        className="w-10 h-10 p-0 border-none bg-transparent mt-1 cursor-pointer"
                    />
                </label>
            </form>
        </>
    );
}
export default BasicControlls;