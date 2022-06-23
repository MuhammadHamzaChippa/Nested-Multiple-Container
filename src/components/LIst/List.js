import React, { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Item from './Item'
const List = () => {
    const [items, setItems] = useState({
        A: [{ id: "1", text: "A1" }, { id: "2", text: "A2" }, { id: "3", text: "A3" }, { id: "4", text: "A4" }, { id: "5", text: "A5" }],
        B: [{ id: "6", text: "B1" }, { id: "7", text: "B2" }, { id: "8", text: "B3" }, { id: "9", text: "B4" }, { id: "10", text: "B5" }]
    })

    const [containers, setContainers] = useState(Object.keys(items))
    const removeFromList = (list, index) => {
        const result = Array.from(list);
        const [removed] = result.splice(index, 1);
        return [removed, result];
    };

    const addToList = (list, index, element) => {
        const result = Array.from(list);
        result.splice(index, 0, element);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        console.log(result)
        const listCopy = { ...items };

        const sourceList = listCopy[result.source.droppableId];
        const [removedElement, newSourceList] = removeFromList(
            sourceList,
            result.source.index
        );
        listCopy[result.source.droppableId] = newSourceList;
        const destinationList = listCopy[result.destination.droppableId];
        listCopy[result.destination.droppableId] = addToList(
            destinationList,
            result.destination.index,
            removedElement
        );

        setItems(listCopy);
    };

    return (
        <div className='p-[20px] bg-[grey] m-[20px]' id="main__area">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-2 gap-[10px]'>
                    {containers.map((container, index) => {
                        return (
                            <div className='bg-[green] p-[10px]' key={index}>
                                <div className='bg-[white] text-center'>{container}</div>
                                <Droppable droppableId={container} >
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="bg-[red] p-[5px]">
                                            {items[container].map((item, index) => (
                                                <Item item={item} index={index} />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>
            </DragDropContext>
        </div>
    )
}

export default List