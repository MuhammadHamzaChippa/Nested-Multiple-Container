import React, { useState, useRef, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import Item from './Item';


const Grid = () => {
    const [items, setItems] = useState({
        A:  [{id: "1" , text: "A1"} , {id: "2" , text: "A2"} , {id: "3" , text: "A3"}  , {id: "4" , text: "A4"}  , {id: "5" , text: "A5"} ],
        B: [{id: "6" , text: "B1"} , {id: "7" , text: "B2"} , {id: "8" , text: "B3"}  , {id: "9" , text: "B4"}  , {id: "10" , text: "B5"}]
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
        return Object.keys(items).find((key) => items[key].map(item => item.id).includes(id));
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor , {}) , 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragStart = (result) => {
        const container = findContainer(result.active.id)
        const idx = items[container].findIndex(item => item.id === result.active.id)
        console.log("Start" , result)
        setActiveId(items[container][idx])
    }

    const handleDragOver = (result) => {
        console.log("Drag Over", result)
        const {active, over} = result;
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
                
                const overIndex = overItems.findIndex(item => item.id === overId);
                const activeIndex = activeItems.findIndex(item => item.id === active.id)

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
                        (item) => item.id !== active.id
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

    const handleDragEnd = (result) => {
       const {active, over} = result
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
            const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);
            const overIndex = items[overContainer].findIndex(item => item.id === overId);
  
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
                                <SortableContext items={items[container].map(item => item.id)} strategy={rectSortingStrategy}>
                                    {items[container].map(item => {
                                        return (
                                            <Item item={item} key={item.id} />
                                        )
                                    })}
                                    <DragOverlay>
                                        {activeId ? (
                                            <Item item={activeId} />
                                        ) : null}
                                    </DragOverlay> 
                                    
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