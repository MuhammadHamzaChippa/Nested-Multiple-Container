import React, { useState } from "react";
import {
    DndContext,
    TouchSensor,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    sortableKeyboardCoordinates,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "./Item";
const NestedList = () => {
    const [activeItem, setActiveItem] = useState();
    const [items, setItems] = useState({
        A: [
            {
                id: "1",
                text: "A1",
                blocks: [
                    { id: "11", text: "1 - subtextA1" },
                    { id: "12", text: "2 - subtextA1" },
                    { id: "13", text: "3 - subtextA1" },
                ],
            },
            {
                id: "2",
                text: "A2",
                blocks: [
                    { id: "14", text: "1 - subtextA2" },
                    { id: "15", text: "2 - subtextA2" },
                    { id: "16", text: "3 - subtextA2" },
                ],
            },
            {
                id: "3",
                text: "A3",
                blocks: [
                    { id: "17", text: "1 - subtextA3" },
                    { id: "18", text: "2 - subtextA3" },
                    { id: "19", text: "3 - subtextA3" },
                ],
            },
        ],
        B: [
            {
                id: "6",
                text: "B1",
                blocks: [
                    { id: "19", text: "1 - subtextB1" },
                    { id: "20", text: "2 - subtextB1" },
                    { id: "21", text: "3 - subtextB1" },
                ],
            },
            {
                id: "7",
                text: "B2",
                blocks: [
                    { id: "22", text: "1 - subtextB2" },
                    { id: "23", text: "2 - subtextB2" },
                    { id: "24", text: "3 - subtextB2" },
                ],
            },
            {
                id: "8",
                text: "B3",
                blocks: [
                    { id: "25", text: "1 - subtextB3" },
                    { id: "26", text: "2 - subtextB3" },
                    { id: "27", text: "3 - subtextB3" },
                ],
            },
        ],
    });


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (result) => {
        // const idx = libraries.findIndex((library) => library.id === result.active.id);
        // setActiveItem(libraries[idx]);
    };

    const findCard = (result) => {};

    const handleDragOver = (result) => {
        console.log(result);
    };

    const handleDragEnd = (result) => {
        // const { active, over } = result;
        // console.log(result);
        // if (active.id !== over.id) {
        //     setLibraries((items) => {
        //         const oldIndex = items.findIndex((item) => item.id === active.id);
        //         const newIndex = items.findIndex((item) => item.id === over.id);

        //         return arrayMove(items, oldIndex, newIndex);
        //     });
        // }
        // setActiveItem(null);
    };

    const handleDragCancel = () => {
        setActiveItem(null);
    };

    return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div
                    style={{
                        display: "inline-grid",
                        boxSizing: "border-box",
                        padding: 20,
                        gridAutoFlow: "column",
                        width: "100%",
                    }}
                >
                    {Object.keys(items).map((container) => {
                        return (
                            <div className="bg-[grey] text-center">
                                <h1 className="mt-[10px] text-[24px]">{container}</h1>
                                <div className="bg-[green] grid grid-rows-4 gap-2 p-[20px] m-[10px] ">
                                <SortableContext
                                        items={items[container].map((item) => item.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {items[container].map((item) => {
                                            return (
                                            <Item item={item} key={item.id}>
                                                <SortableContext
                                                items={item.blocks.map((block) => block.id)}
                                                strategy={verticalListSortingStrategy}
                                                >
                                                    {item.blocks.map((block) => {
                                                        return (
                                                            <Block block={block} key={block.id} />
                                                        )
                                                    })}
                                                </SortableContext>
                                            </Item>);
                                        })}
                                    </SortableContext>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DndContext>
    );
};

const Block = ({ block }) => {
    const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({ id: block.id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    const styles = {
        container: `${isDragging ? "opacity-[0.5]" : "opacity-1"} bg-[lightblue] text-center my-2 p-2`,
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styles.container}>
            {block.text}
        </div>
    );
};

export default NestedList;
