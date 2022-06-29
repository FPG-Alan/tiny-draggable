import { makeDraggable } from "./core";
import { createDragDom } from "./util";
import type { DraggableOptions } from "./type";

function draggable(dom: HTMLElement, options: DraggableOptions = {}) {
  // get dragHandler
  let dragHandler = dom;
  if (options.dragHandler) {
    if (typeof options.dragHandler === "string") {
      dragHandler = dom.querySelector(options.dragHandler) || dom;
    } else if (options.dragHandler instanceof HTMLElement) {
      dragHandler = options.dragHandler;
    }
  }

  const handler = makeDraggable(dragHandler, dom);

  if (handler) {
    if (options.dragZone) {
      handler.on("beforeDrag", (context) => {
        const originRect = dom.getBoundingClientRect();
        const zoneRect = options.dragZone?.getBoundingClientRect();

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
    if (options.useSubstitute) {
      handler.on("beforeDrag", (context) => {
        const substitute = createDragDom(dom);
        substitute.style.visibility = "hidden";

        if (options.substituteClass) {
          substitute.className = options.substituteClass;
        }
        context.dragTarget = substitute;
      });

      handler.on("dragStart", (context) => {
        context.dragTarget.style.visibility = "visible";
      });
      handler.on("dragEnd", (context) => {
        context.dragTarget.parentNode?.removeChild(context.dragTarget);
      });
    }
    if (options.holdPosition) {
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

      if (options.holdPosition) {
        accX = context["currentTranslateX"] =
          (context["originTranslateX"] as number) + accX;
        accY = context["currentTranslateY"] =
          (context["originTranslateY"] as number) + accY;
      }
      context.dragTarget.style.transform = `translate(${accX}px, ${accY}px)`;
    });

    return handler;
  }
}

export { draggable };
