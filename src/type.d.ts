export type DragData = {
  dragging: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;

  accRange: { x: [number, number]; y: [number, number] };

  [key: string]: unknown;
};

export type DraggableCorOptions = {
  /**
   * disable drag on X axis
   */
  disable_x_axis?: boolean;
  /**
   * disable drag on Y axis
   */
  disable_y_axis?: boolean;
};
export type DraggableOptions = DraggableCorOptions & {
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
