"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOverlap = isOverlap;
exports.rectOverlap = void 0;

function sortCollisionsDesc(_ref, _ref2) {
  var a = _ref.data.value;
  var b = _ref2.data.value;
  return b - a;
}
/**
 * Returns the intersecting rectangle area between two rectangles
 */


function isOverlap(entry, target) {
  var top = Math.max(target.top, entry.top);
  var left = Math.max(target.left, entry.left);
  var right = Math.min(target.left + target.width, entry.left + entry.width);
  var bottom = Math.min(target.top + target.height, entry.top + entry.height);
  var width = right - left;
  var height = bottom - top;

  if (left < right && top < bottom) {
    var targetArea = target.width * target.height;
    var entryArea = entry.width * entry.height;
    var intersectionArea = width * height;

    if (intersectionArea === targetArea) {
      return true;
    }
  } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)


  return false;
}
/**
 * Returns the rectangles that has the greatest intersection area with a given
 * rectangle in an array of rectangles.
 */


var rectOverlap = function rectOverlap(_ref3) {
  var collisionRect = _ref3.collisionRect,
      droppableRects = _ref3.droppableRects,
      droppableContainers = _ref3.droppableContainers;
  var collisions = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = droppableContainers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var droppableContainer = _step.value;
      var id = droppableContainer.id;
      var rect = droppableRects.get(id);

      if (rect) {
        var _isOverlap = _isOverlap(rect, collisionRect);

        if (_isOverlap) {
          collisions.push({
            id: id,
            data: {
              droppableContainer: droppableContainer,
              value: _isOverlap
            }
          });
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return collisions.sort(sortCollisionsDesc);
};

exports.rectOverlap = rectOverlap;