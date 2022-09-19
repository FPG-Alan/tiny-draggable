import type { DragData, DraggableCoreOptions } from "./type";
import { PubSubEvent } from "./util";

export const DRAGGABLE_FLAG = "tiny-draggable";

type DragEvent = "beforeDrag" | "dragStart" | "dragging" | "dragEnd" | "click";
export type DragCallback = (
  context: DragData,
  e: MouseEvent
) => Record<string, unknown> | void;

export class DragContext extends PubSubEvent {
  public options: DraggableCoreOptions;
  public state: DragData;
  public dragHandler: HTMLElement;

  public mouseDownHandler;
  public mouseMoveHandler;
  public mouseUpHandler;

  constructor(dragHandler: HTMLElement, options: DraggableCoreOptions) {
    super();
    this.options = options;
    this.dragHandler = dragHandler;

    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);

    this.state = {
      dragging: false,
      originX: 0,
      originY: 0,
      currentX: 0,
      currentY: 0,

      // drag zone
      accRange: { x: [Infinity * -1, Infinity], y: [Infinity * -1, Infinity] },
    };
  }

  public on(eventName: DragEvent, callback: DragCallback): void {
    super.on(eventName, callback);
  }

  public emit(eventName: DragEvent, e: MouseEvent) {
    const result = super.emit(eventName, this.state, e);

    if (typeof result === "boolean") {
      return result;
    }
    if (result) {
      delete result.dragging;
      delete result.originX;
      delete result.originY;
      delete result.currentX;
      delete result.currentY;
      delete result.accRange;

      this.state = {
        ...this.state,
        ...result,
      };

      return result;
    }
  }

  public destroy(): void {
    console.log("destroy drag context");
    this.off();
    this.dragHandler.removeEventListener("mousedown", this.mouseDownHandler);
    window.removeEventListener("mousemove", this.mouseMoveHandler);
    window.removeEventListener("mouseup", this.mouseUpHandler);
    this.dragHandler.removeAttribute(DRAGGABLE_FLAG);
  }

  private onMouseDown(e: MouseEvent) {
    this.state.currentX = this.state.originX = e.clientX;
    this.state.currentY = this.state.originY = e.clientY;
    const result = this.emit("beforeDrag", e);
    // stop a drag by return false on beforeDrag event
    if (typeof result !== "boolean" || result) {
      document.getElementsByTagName("body")[0].style.userSelect = "none";
      window.addEventListener("mousemove", this.mouseMoveHandler);
      window.addEventListener("mouseup", this.mouseUpHandler);
    }
  }

  private onMouseMove(e: MouseEvent) {
    const axis = this.options.axis || "both";
    let debounce = this.options.debounce || 0;

    if (axis === "none") {
      return;
    }

    if (!(typeof debounce === "number" && !isNaN(debounce))) {
      // debounce is not a number
      debounce = 0;
    }

    const dragData = this.state;
    dragData.currentX = e.clientX;
    dragData.currentY = e.clientY;
    const xChange = Math.abs(dragData.currentX - dragData.originX);
    const yChange = Math.abs(dragData.currentY - dragData.originY);
    if (
      (axis === "x" && xChange > 0) ||
      (axis === "y" && yChange > 0) ||
      (axis === "both" && (xChange > 0 || yChange > 0))
    ) {
      if (xChange > debounce || yChange > debounce) {
        if (!dragData.dragging) {
          dragData.dragging = true;
          this.emit("dragStart", e);
        }
        this.emit("dragging", e);
      }
    }
  }

  private onMouseUp(e: MouseEvent) {
    window.removeEventListener("mousemove", this.mouseMoveHandler);
    window.removeEventListener("mouseup", this.mouseUpHandler);
    document.getElementsByTagName("body")[0].style.userSelect = "auto";
    if (!this.state.dragging) {
      this.emit("click", e);
    }
    this.emit("dragEnd", e);

    this.state.dragging = false;
  }
}

const DEFAULT_OPTIONS: DraggableCoreOptions = {
  axis: "both",
  debounce: 0,
  useCapturing: true,
};
function makeDraggable(
  dragHandler: HTMLElement,
  _options?: DraggableCoreOptions
) {
  const options = { ...DEFAULT_OPTIONS, ...(_options || {}) };
  // check if the dom is already draggable
  const oldId = dragHandler.getAttribute(DRAGGABLE_FLAG);
  if (oldId) {
    console.log(`the dom had been proceed as draggable.`);

    return;
  }

  // generate drage context
  const context = new DragContext(dragHandler, options);
  const id = window.crypto.randomUUID();

  context.dragHandler.setAttribute(DRAGGABLE_FLAG, id);

  // bind event
  context.dragHandler.addEventListener(
    "mousedown",
    context.mouseDownHandler,
    !!options.useCapturing
  );

  return context;
}

export { makeDraggable };
