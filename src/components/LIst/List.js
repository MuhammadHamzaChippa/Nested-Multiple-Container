import React, { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Item from './Item'
const List = () => {
    const [items, setItems] = useState({
        A: [{
            id: "1", text: "A1",
            blocks: [{ id: "11", text: '1 - subtextA1' }, { id: "12", text: "2 - subtextA1" }, { id: "13", text: "3 - subtextA1" }]
        },
        {
            id: "2", text: "A2",
            blocks: [{ id: "14", text: '1 - subtextA2' }, { id: "15", text: "2 - subtextA2" }, { id: "16", text: "3 - subtextA2" }]
        },
        {
            id: "3", text: "A3",
            blocks: [{ id: "17", text: '1 - subtextA3' }, { id: "18", text: "2 - subtextA3" }, { id: "19", text: "3 - subtextA3" }]
        },
        ],
        B: [{
            id: "6", text: "B1",
            blocks: [{ id: "19", text: '1 - subtextB1' }, { id: "20", text: "2 - subtextB1" }, { id: "21", text: "3 - subtextB1" }]
        },
        {
            id: "7", text: "B2",
            blocks: [{ id: "22", text: '1 - subtextB2' }, { id: "23", text: "2 - subtextB2" }, { id: "24", text: "3 - subtextB2" }]
        },
        {
            id: "8", text: "B3",
            blocks: [{ id: "25", text: '1 - subtextB3' }, { id: "26", text: "2 - subtextB3" }, { id: "27", text: "3 - subtextB3" }]
        }]
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

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        console.log(result)
        const newItems = { ...items };


        const sourceIndex = result.source.index
        const destinationIndex = result.destination.index
        if (result.type === "cards") {
            const sourceContainer = result.source.droppableId
            const destinationContainer = result.destination.droppableId
            const sourceList = newItems[sourceContainer];
            const [removedElement, newSourceList] = removeFromList(
                sourceList,
                sourceIndex
            );
            newItems[sourceContainer] = newSourceList;
            const destinationList = newItems[destinationContainer];
            newItems[destinationContainer] = addToList(
                destinationList,
                destinationIndex,
                removedElement
            );

            setItems(newItems);
        }

        if (result.type === 'blocks') {
            const [sourceContainer, sourceCardId] = result.source.droppableId.split(',')
            const [destinationContainer, destinationCardId] = result.destination.droppableId.split(',')
            const sourceList = newItems[sourceContainer]
            const destinationList = newItems[destinationContainer]
            const sourceBlocks = sourceList.find(card => card.id === sourceCardId).blocks
            const destinationBlocks = destinationList.find(card => card.id === destinationCardId).blocks
            if (sourceCardId === destinationCardId) {
                // order it in the same block
                const reorderedBlocks = reorder(sourceBlocks, sourceIndex, destinationIndex)
                const newSourceList = sourceList.map(card => {
                    if (card.id === sourceCardId) {
                        card.blocks = reorderedBlocks
                    }
                    return card
                } )
                newItems[sourceContainer] = newSourceList
                setItems(newItems)
            }
            else { 
                const [removedBlock, newSourceBlocks] = removeFromList(
                    sourceBlocks,
                    sourceIndex
                ); 
                const newDestinationBlocks = addToList(
                    destinationBlocks,
                    destinationIndex,
                    removedBlock
                );
                const newSourceList = sourceList.map(card =>{
                    if (card.id === sourceCardId) {
                        card.blocks = newSourceBlocks
                    }
                    return card
                })
                const newDestinationList = destinationList.map( card => {
                    if (card.id === destinationCardId) {
                        card.blocks = newDestinationBlocks
                    }
                    return card
                })
                newItems[sourceContainer] = newSourceList
                newItems[destinationContainer] = newDestinationList
                setItems(newItems)

            }
        }


    };

    return (
        <div className='p-[20px] bg-[grey] m-[20px]' id="main__area">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-2 gap-[10px]'>
                    {containers.map((container, index) => {
                        return (
                            <div className='bg-[green] p-[10px]' key={index}>
                                <div className='bg-[white] text-center'>{container}</div>
                                <Droppable droppableId={container} type="cards">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="bg-[red] p-[5px]">
                                            {items[container].map((item, index) => (
                                                <Item item={item} container={container} index={index} />
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