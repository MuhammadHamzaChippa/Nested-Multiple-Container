import React, { useState } from 'react'
import {
  DndContext, useSensors, useSensor, KeyboardSensor, PointerSensor, TouchSensor, useDraggable, useDroppable, pointerWithin
} from '@dnd-kit/core'
import './Board.css'
import { restrictToParentElement, restrictToWindowEdges } from '@dnd-kit/modifiers'

const Card = ({ item }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: item.id,
  });
  const style = {
    top: `${item.y}px`,
    left: `${item.x}px`,
    '--translate-x': `${transform?.x ?? 0}px`,
    '--translate-y': `${transform?.y ?? 0}px`,
  }




  return (
    <div
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      className='bg-[white] p-[20px] w-fit relative dragging'>
      {item.text}
    </div>
  )
}

const Droppable = ({ container, children }) => {
  const { setNodeRef } = useDroppable({
    id: container
  })
  return (
    <div ref={setNodeRef} className='bg-[grey] '>
      {children}
    </div>
  )
}

const Board = () => {
  const [items, setItems] = useState({
    A: [{ id: "1", x: 0, y: 0, text: "Card A1" },
    { id: "2", x: 200, y: 200, text: "Card A2" },
    { id: "3", x: 300, y: 300, text: "Card A3" },],
    B: [{ id: "4", x: 0, y: 0, text: "Card B1" },
    { id: "5", x: 200, y: 200, text: "Card B2" },
    { id: "6", x: 300, y: 300, text: "Card B3" },]
  }
  )


  const [containers, setContainers] = useState(Object.keys(items))


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );


  const findContainer = (id) => {
    if (id in items) {
      return id
    }
    return Object.keys(items).find((key) => items[key].map(item => item.id).includes(id));
  }

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

  const onDragOver = (result) => {
    const { active, over, delta } = result;
    if (!over) {
      return;
    }

    const draggableId = active.id
    const destinationContainer = over?.id
    const sourceContainer = findContainer(draggableId)


    if (!sourceContainer || !destinationContainer) {
      console.log("No container found");
      return;
    }

    let newItems = { ...items }

    if (sourceContainer !== destinationContainer) {
      const sourceItems = items[sourceContainer];
      const destinationItems = items[destinationContainer];
      const itemIdx = sourceItems.findIndex(item => item.id === draggableId)
      const [removedItem, newSourceList] = removeFromList(sourceItems, itemIdx)

      newItems[sourceContainer] = newSourceList
      newItems[destinationContainer] = {removedItem , ...destinationItems}

    }


  }



  const onDragEnd = (result) => {
    const { active, over, delta } = result;
    if (!over) {
      return;
    }
    const destinationContainer = over.id;
    const draggableId = active.id
    const sourceContainer = findContainer(draggableId)
    let newItems = { ...items }


    const sourceList = items[sourceContainer]
    const newSourceList = sourceList.map(item => {
      if (item.id === draggableId) {
        return {
          ...item,
          x: item.x + delta.x,
          y: item.y + delta.y
        }
      }
      return item
    })
    newItems[sourceContainer] = newSourceList


    setItems(newItems)

  }


  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      modifiers={[restrictToWindowEdges]}
      collisionDetection={pointerWithin}
    >

      <div className='grid grid-cols-2 gap-[250px] p-[100px] bg-[black] h-screen'>
        {containers.map((container) => (
          <Droppable container={container} key={container}>
            {items[container].map((item) => (
              <Card item={item} key={item.id} />
            ))}
          </Droppable>
        ))}
      </div>

    </DndContext>
  )
}

export default Board