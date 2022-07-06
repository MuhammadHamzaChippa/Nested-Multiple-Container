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


    const findContainer = (id) => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) => items[key].map((item) => item.id).includes(id));
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState();


    const handleDragStart = (result) => {
        if (result.active.data.current.type === "card") {
        const container = findContainer(result.active.id);
        const idx = items[container].findIndex((item) => item.id === result.active.id);
        console.log("Start", result);
        setActiveId(items[container][idx]);
    }
    };



    const handleDragOver = (result) => {
        console.log("Drag Over", result);
        const { active, over } = result;
        const overId = over?.id;
        if (overId == null || active.id in items) {
            return;
        }
        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
            console.log("No container found");
            return;
        }

        if (activeContainer !== overContainer) {
            setItems((items) => {
                const activeItems = items[activeContainer];
                const overItems = items[overContainer];

                const overIndex = overItems.findIndex((item) => item.id === overId);
                const activeIndex = activeItems.findIndex((item) => item.id === active.id);

                let newIndex;
                if (overId in items) {
                    newIndex = overItems.length + 1;
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top > over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;
                    newIndex = overIndex > 0 ? overIndex + modifier : overItems.length + 1;
                }

                // recentlyMovedToNewContainer.current = true;

                return {
                    ...items,
                    [activeContainer]: items[activeContainer].filter((item) => item.id !== active.id),
                    [overContainer]: [
                        ...items[overContainer].slice(0, newIndex),
                        items[activeContainer][activeIndex],
                        ...items[overContainer].slice(newIndex, items[overContainer].length),
                    ],
                };
            });
        }
    };

    const handleDragEnd = (result) => {
        const { active, over } = result;
        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveId(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);
        if (overContainer) {
            const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
            const overIndex = items[overContainer].findIndex((item) => item.id === overId);

            if (activeIndex !== overIndex) {
                setItems((items) => ({
                    ...items,
                    [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
                }));
            }
        }
        setActiveId(null);
    };

    const onDragCancel = () => {
        setActiveId(null);
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
                            <div style={{background: "grey" , textAlign: "center"}}>
                                <h1 style={{marginTop: 10 , fontSize: 24}}>{container}</h1>
                                <div style={{background: "green" , display: "flex" , flexDirection: "column" ,padding: 20, margin: 10}}>
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
        opacity: isDragging ? 0.5 : 1 , 
        background: "lightblue",
        textAlign: "center",
        margin: 10, 
        padding: 5
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} >
            {block.text}
        </div>
    );
};

export default NestedList;
