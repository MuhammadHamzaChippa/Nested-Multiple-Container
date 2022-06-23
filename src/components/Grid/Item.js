import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Item = ({item}) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transition,
        transform,
        isDragging
    } = useSortable({ id: item.id })

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
            className='bg-[yellow] p-[50px] text-center opacity-1'
            style={style}>
            {item.text}
        </div>
    )
}

export default Item