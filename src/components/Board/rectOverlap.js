
function sortCollisionsDesc({data: {value: a}}, {data: {value: b}}) {
  return b - a;
}

/**
 * Returns the intersecting rectangle area between two rectangles
 */
export function getIntersectionRatio(
  entry,
  target
) {
  const top = Math.max(target.top, entry.top);
  const left = Math.max(target.left, entry.left);
  const right = Math.min(target.left + target.width, entry.left + entry.width);
  const bottom = Math.min(target.top + target.height, entry.top + entry.height);
  const width = right - left;
  const height = bottom - top;

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height;
    const entryArea = entry.width * entry.height;
    const intersectionArea = width * height;
    console.log(intersectionArea , " " , targetArea)
    if (intersectionArea === targetArea) {
      console.log(true)
      return true
    }
  }

  // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
  return false;
}

/**
 * Returns the rectangles that has the greatest intersection area with a given
 * rectangle in an array of rectangles.
 */
export const rectOverlap = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const collisions  = [];

  for (const droppableContainer of droppableContainers) {
    const {id} = droppableContainer;
    const rect = droppableRects.get(id);


    if (rect) {
      const isOverlap = getIntersectionRatio(rect, collisionRect);

      if (isOverlap) {
        collisions.push({
          id,
          data: {droppableContainer, value: isOverlap},
        });
      }
    }
  }

  return collisions.sort(sortCollisionsDesc);
};

