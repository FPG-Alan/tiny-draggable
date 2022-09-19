export type DragData = {
  dragging: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;

  accRange: { x: [number, number]; y: [number, number] };

  [key: string]: unknown;
};

export type DraggableCoreOptions = {
  /**
   * response to dragging on each axis
   */
  axis?: "both" | "x" | "y" | "none";

  /**
   * will not trigger drag behavior whthin the debounce value range
   */
  debounce?: number;

  /**
   * use capturing
   */
  useCapturing?: true;
};
export type DraggableOptions = DraggableCoreOptions & {
  /**
   * specific [dom / dom class name] which bind the drag event
   * dragHandler need be child of draggable dom
   */
  dragHandler?: string | HTMLElement;
  /**
   * use bounding rect of a dom as restricted area of drag
   */
  dragZone?: HTMLElement;
  /**
   * use substitute dom as draggable
   */
  useSubstitute?: boolean;
  /**
   * class of substitute dom
   */
  substituteClass?: string;
  /**
   * save position after last drag end
   */
  holdPosition?: boolean;
};
