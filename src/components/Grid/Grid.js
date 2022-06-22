import React, { useState, useRef, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";

const Item = ({ item }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transition,
        transform,
        isDragging
    } = useSortable({ id: item })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        // border: isDragging ? "3px solid red" : "1px solid black",
        // backgroundColor: isDragging ? "#89dbff" : "white",
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className='bg-[yellow] p-[50px] text-center'
            style={style}>
            {item}
        </div>
    )
}

const Grid = () => {
    const [items, setItems] = useState({
        A: ["A1" , "A2" , "A3" , "A4" , "A5"],
        B: ["B1" , "B2" , "B3" , "B4" , "B5"]
    }
    )
    const [containers, setContainers] = useState(Object.keys(items))
    const [activeId, setActiveId] = useState()
    const recentlyMovedToNewContainer = useRef(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);

    const findContainer = (id) => {
        if (id in items) {
            return id
        }
        return Object.keys(items).find((key) => items[key].includes(id));
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragStart = ({ active }) => {
        console.log(active.id)
        setActiveId(active.id)
    }

    const handleDragOver = ({ active, over }) => {
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
                const overIndex = overItems.indexOf(overId);
                const activeIndex = activeItems.indexOf(active.id)

                let newIndex;
                if (overId in items) {
                    newIndex = overItems.length + 1
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;
                    newIndex = overIndex > 0 ? overIndex + modifier : overItems.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                return {
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (item) => item !== active.id
                    ),
                    [overContainer]: [
                        ...items[overContainer].slice(0, newIndex),
                        items[activeContainer][activeIndex],
                        ...items[overContainer].slice(
                            newIndex,
                            items[overContainer].length
                        ),
                    ],
                };
            });
        }
    }

    const handleDragEnd = ({ active, over }) => {
       const activeContainer = findContainer(active.id) ; 
       
       if (!activeContainer) {
        setActiveId(null); 
        return ;
       }
       
       const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        const overContainer = findContainer(overId);
        if (overContainer) {
            const activeIndex = items[activeContainer].indexOf(active.id);
            const overIndex = items[overContainer].indexOf(overId);
  
            if (activeIndex !== overIndex) {
              setItems((items) => ({
                ...items,
                [overContainer]: arrayMove(
                  items[overContainer],
                  activeIndex,
                  overIndex
                ),
              }));
            }
          }
          setActiveId(null);

    }

    const onDragCancel =() => {
        setActiveId(null)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragCancel={onDragCancel}
        >
            <div
                style={{
                    display: 'inline-grid',
                    boxSizing: 'border-box',
                    padding: 20,
                    gridAutoFlow: 'column',
                }}
            >
                {containers.map((container) => {
                    return (
                        <div className='bg-[grey]'>
                            <h1>{container}</h1>
                            <div className='bg-[green] grid grid-cols-4 gap-4 p-[20px] m-[10px]'>
                                <SortableContext items={items[container]} strategy={rectSortingStrategy}>
                                    {items[container].map(item => {
                                        return (
                                            <Item item={item} key={item} />
                                        )
                                    })}
                                    {/* <DragOverlay>
                                        {activeItem ? (
                                            <Item item={activeItem} />
                                        ) : null}
                                    </DragOverlay> */}
                                </SortableContext>
                            </div>
                        </div>
                    )
                })}
            </div>

        </DndContext>
    )
}

export default Grid