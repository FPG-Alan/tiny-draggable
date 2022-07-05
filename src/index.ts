import { makeDraggable } from "./core";
import { createDragDom } from "./util";
import type { DraggableOptions } from "./type";

function draggable(dom: HTMLElement, options: DraggableOptions = {}) {
  const {
    dragHandler,
    dragZone,
    useSubstitute,
    substituteClass,
    holdPosition,
    ...coreOptions
  } = options;

  // get dragHandlerDom
  let dragHandlerDom = dom;
  if (dragHandler) {
    if (typeof dragHandler === "string") {
      dragHandlerDom = dom.querySelector(dragHandler) || dom;
    } else if (dragHandler instanceof HTMLElement) {
      dragHandlerDom = dragHandler;
    }
  }

  const handler = makeDraggable(dragHandlerDom, coreOptions);

  if (handler) {
    if (dragZone) {
      handler.on("beforeDrag", (context) => {
        const originRect = dom.getBoundingClientRect();
        const zoneRect = dragZone?.getBoundingClientRect();

        if (zoneRect) {
          context.accRange = {
            x: [
              (originRect.left - zoneRect.left) * -1,
              zoneRect.right - originRect.right,
            ],
            y: [
              (originRect.top - zoneRect.top) * -1,
              zoneRect.bottom - originRect.bottom,
            ],
          };
        }
      });
    }
    if (useSubstitute) {
      handler.on("beforeDrag", () => {
        const substitute = createDragDom(dom);
        substitute.style.visibility = "hidden";

        if (substituteClass) {
          substitute.className = substituteClass;
        }
        return { dragTarget: substitute };
      });

      handler.on("dragStart", (context) => {
        (context.dragTarget as HTMLElement).style.visibility = "visible";
      });
      handler.on("dragEnd", (context) => {
        (context.dragTarget as HTMLElement).parentNode?.removeChild(
          context.dragTarget as HTMLElement
        );
      });
    }
    if (holdPosition) {
      handler.on("beforeDrag", (context) => {
        return {
          originTranslateX: context["currentTranslateX"] ?? 0,
          originTranslateY: context["currentTranslateY"] ?? 0,

          currentTranslateX: 0,
          currentTranslateY: 0,
        };
      });
      // currentTranslateX/Y will be 0 when not drag at all
      // so we need set it as origin valus for next round
      handler.on("click", (context) => {
        context.currentTranslateX = context["originTranslateX"];
        context.currentTranslateY = context["originTranslateY"];
      });
    }

    handler.on("dragging", (context) => {
      let accX = Math.min(
        context.accRange.x[1],
        Math.max(context.accRange.x[0], context.currentX - context.originX)
      );
      let accY = Math.min(
        context.accRange.y[1],
        Math.max(context.accRange.y[0], context.currentY - context.originY)
      );

      if (holdPosition) {
        accX = context["currentTranslateX"] =
          (context["originTranslateX"] as number) + accX;
        accY = context["currentTranslateY"] =
          (context["originTranslateY"] as number) + accY;
      }
      (
        (context.dragTarget as HTMLElement | undefined) || dom
      ).style.transform = `translate(${accX}px, ${accY}px)`;
    });

    return handler;
  }
}

export default draggable;
