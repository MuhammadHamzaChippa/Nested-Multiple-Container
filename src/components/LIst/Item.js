import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const SubItem = ({ item, container }) => {
    return (
        <div>
            <Droppable droppableId={`${container},${item.id}`} type="blocks">
                {(provided, snapshot) => (
                    <div className='bg-[lightblue] p-[5px]' ref={provided.innerRef}
                    >
                        {item.blocks.map((block, index) => {
                            return (
                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div>
                                            <div
                                                style={{ ...provided.draggableProps.style }}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-[orange] my-[5px] text-center p-[5px]">
                                                {block.text}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}

                                </Draggable>
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
const Item = ({ item, index, container }) => {
    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
            {(provided, snapshot) => {
                return (
                    <div className='flex items-center'>
                        <div
                            ref={provided.innerRef}
                            snapshot={snapshot}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                            className='bg-[yellow] my-[10px] text-center p-[10px] grow' >
                            {item.text}
                            <SubItem item={item} container={container} />
                        </div>
                        {provided.placeholder}
                    </div>
                )
            }}

        </Draggable>
    )
}

export default Item