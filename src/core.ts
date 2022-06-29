import type { DragData } from "./type";
import { PubSubEvent } from "./util";

export const DRAGGABLE_FLAG = "tiny-draggable";

type DragEvent = "beforeDrag" | "dragStart" | "dragging" | "dragEnd" | "click";
export type DragCallback = (
  context: DragData,
  e: MouseEvent
) => Record<string, unknown> | void;

const ContextPool: Record<string, DragContext> = {};

let currentContext: DragContext | null = null;

export class DragContext extends PubSubEvent {
  public state: DragData;
  public dragHandler: HTMLElement;

  constructor(dragHandler: HTMLElement, dragTarget?: HTMLElement) {
    super();
    this.dragHandler = dragHandler;

    this.state = {
      dragging: false,
      originX: 0,
      originY: 0,
      currentX: 0,
      currentY: 0,

      dragTarget: dragTarget || dragHandler,

      // drag zone
      accRange: { x: [Infinity * -1, Infinity], y: [Infinity * -1, Infinity] },
    };
  }

  public on(eventName: DragEvent, callback: DragCallback): void {
    super.on(eventName, callback);
  }

  public emit(eventName: DragEvent, e: MouseEvent) {
    const result = super.emit(eventName, this.state, e);

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
    }

    return result;
  }

  public destroy(): void {
    console.log("destroy drag context");
    this.off();
    const poolId = this.dragHandler.getAttribute(DRAGGABLE_FLAG);

    if (poolId) {
      delete ContextPool[poolId];
      this.dragHandler.removeEventListener("mousedown", onMouseDown);
      this.dragHandler.removeAttribute(DRAGGABLE_FLAG);
    }
  }
}

function makeDraggable(dragHandler: HTMLElement, dragTarget?: HTMLElement) {
  // check if the dom is already draggable
  const oldId = dragHandler.getAttribute(DRAGGABLE_FLAG);
  if (oldId && ContextPool[oldId]) {
    console.log(`the dom had been proceed as draggable.`);

    return;
  }

  // generate drage context
  const context = new DragContext(dragHandler, dragTarget);
  const id = window.crypto.randomUUID();

  context.dragHandler.setAttribute(DRAGGABLE_FLAG, id);
  ContextPool[id] = context;

  // bind event
  context.dragHandler.addEventListener("mousedown", onMouseDown);

  return ContextPool[id];
}

function onMouseDown(e: MouseEvent) {
  if (e.currentTarget instanceof Element) {
    const target = e.currentTarget as HTMLElement;
    const context = ContextPool[target.getAttribute(DRAGGABLE_FLAG) || ""];
    if (context) {
      // get the correspond context
      context.state.currentX = context.state.originX = e.clientX;
      context.state.currentY = context.state.originY = e.clientY;
      context.emit("beforeDrag", e);
      currentContext = context;
      document.getElementsByTagName("body")[0].style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }
}

function onMouseMove(e: MouseEvent) {
  if (currentContext) {
    const dragData = currentContext.state;
    dragData.currentX = e.clientX;
    dragData.currentY = e.clientY;

    if (
      !dragData.dragging &&
      (dragData.currentX !== dragData.originX ||
        dragData.currentY !== dragData.originY)
    ) {
      dragData.dragging = true;
      currentContext.emit("dragStart", e);
    }

    currentContext.emit("dragging", e);
  }
}

function onMouseUp(e: MouseEvent) {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  document.getElementsByTagName("body")[0].style.userSelect = "auto";
  if (currentContext) {
    if (!currentContext.state.dragging) {
      currentContext.emit("click", e);
    }
    currentContext.emit("dragEnd", e);

    currentContext.state.dragging = false;
    currentContext = null;
  }
}

export { makeDraggable };
