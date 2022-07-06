import { CSS } from "@dnd-kit/utilities";
import {useSortable , SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { Children } from "react";

export const Item = ({ item , children }) => {
    const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({ id: item.id , data: {
        type: "card"
    } });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),

    }
    const styles = {
        container: `${isDragging ? "opacity-[0.5]" : "opacity-1"} bg-[lightgreen] text-center my-2 p-2`,
    };
    return (
        <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={styles.container}
    >
        {item.text}
        {children}
    </div>
    );
};

