import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
const Item = ({ item, index }) => {
    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
            {(provided, snapshot) => {
                return (
                    <div>
                    <div
                        ref={provided.innerRef}
                        snapshot={snapshot}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='bg-[yellow] my-[10px] text-center p-[10px]' >
                        {item.text}
                    </div>
                    {provided.placeholder}
                    </div>
                )
            }}

        </Draggable>
    )
}

export default Item