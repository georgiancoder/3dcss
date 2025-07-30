import { useState, useEffect } from "react";
import type { ObjectItem } from "../../App";

interface TransformControlsProps {
    item: ObjectItem;
}

const TransformControls: React.FC<TransformControlsProps> = ({ item }) => {
    const [rotateX, setRotateX] = useState<number>(item.transform.rotateX);
    const [rotateY, setRotateY] = useState<number>(item.transform.rotateY);
    const [rotateZ, setRotateZ] = useState<number>(item.transform.rotateZ);
    const [translateX, setTranslateX] = useState<number>(item.transform.translateX);
    const [translateY, setTranslateY] = useState<number>(item.transform.translateY);
    const [translateZ, setTranslateZ] = useState<number>(item.transform.translateZ);
    const [scaleX, setScaleX] = useState<number>(item.transform.scaleX);
    const [scaleY, setScaleY] = useState<number>(item.transform.scaleY);
    const [scaleZ, setScaleZ] = useState<number>(item.transform.scaleZ);

    useEffect(() => {
        setRotateX(item.transform.rotateX);
        setRotateY(item.transform.rotateY);
        setRotateZ(item.transform.rotateZ);
        setTranslateX(item.transform.translateX);
        setTranslateY(item.transform.translateY);
        setTranslateZ(item.transform.translateZ);
        setScaleX(item.transform.scaleX);
        setScaleY(item.transform.scaleY);
        setScaleZ(item.transform.scaleZ);
    }, [item]);

    return (
        <>
            <h3 className="text-neutral-400 text-sm">Transform Styles:</h3>
            <form className="flex flex-col gap-4 mt-3">
                {/* Rotate */}
                <div className="flex gap-4">
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Rotate X
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={rotateX}
                            onChange={e => setRotateX(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{rotateX}°</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Rotate Y
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={rotateY}
                            onChange={e => setRotateY(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{rotateY}°</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Rotate Z
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={rotateZ}
                            onChange={e => setRotateZ(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400 w-[calc(50%-10px)]">{rotateZ}°</span>
                    </label>
                </div>
                {/* Translate */}
                <div className="flex gap-4">
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Translate X
                        <input
                            type="range"
                            min={-500}
                            max={500}
                            value={translateX}
                            onChange={e => setTranslateX(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{translateX}px</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Translate Y
                        <input
                            type="range"
                            min={-500}
                            max={500}
                            value={translateY}
                            onChange={e => setTranslateY(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{translateY}px</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Translate Z
                        <input
                            type="range"
                            min={-500}
                            max={500}
                            value={translateZ}
                            onChange={e => setTranslateZ(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{translateZ}px</span>
                    </label>
                </div>
                {/* Scale */}
                <div className="flex gap-4">
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Scale X
                        <input
                            type="range"
                            min={0.1}
                            max={3}
                            step={0.01}
                            value={scaleX}
                            onChange={e => setScaleX(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{scaleX.toFixed(2)}x</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Scale Y
                        <input
                            type="range"
                            min={0.1}
                            max={3}
                            step={0.01}
                            value={scaleY}
                            onChange={e => setScaleY(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{scaleY.toFixed(2)}x</span>
                    </label>
                    <label className="flex flex-col text-xs flex-1 w-[calc(50%-10px)]">
                        Scale Z
                        <input
                            type="range"
                            min={0.1}
                            max={3}
                            step={0.01}
                            value={scaleZ}
                            onChange={e => setScaleZ(Number(e.target.value))}
                            className="mt-1"
                        />
                        <span className="text-right text-xs text-neutral-400">{scaleZ.toFixed(2)}x</span>
                    </label>
                </div>
            </form>
        </>
    );
}
export default TransformControls;