import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './Item.css'

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
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`${isDragging ? 'transparent-div': 'opacity-div' } bg-[yellow] p-[50px] text-center `}
            style={style}>
            {item.text}
        </div>
    )
}

export default Item