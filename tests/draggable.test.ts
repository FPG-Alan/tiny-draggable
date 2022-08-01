/* eslint-disable @typescript-eslint/no-empty-function */
import draggable from "../src";

describe("tiny-draggable:draggable", () => {
  test("return context after make draggable", () => {
    const dom = document.createElement("div");
    const context = draggable(dom);
    expect(context).toBeDefined();
  });

  // ----------------------------------options----------------------------------
  test("options - dragHandler", () => {
    const dom = document.createElement("div");
    const dragHandler = document.createElement("span");
    dragHandler.className = "test";
    dom.appendChild(dragHandler);

    const context = draggable(dom, { dragHandler: ".test" });
    expect(context?.dragHandler).toEqual(dragHandler);
  });

  test("options - dragZone", () => {
    const dom = document.createElement("div");
    const container = document.createElement("div");
    container.appendChild(dom);
    jest.spyOn(container, "getBoundingClientRect").mockImplementation(() => {
      return {
        x: 0,
        y: 0,
        bottom: 500,
        height: 500,
        left: 0,
        right: 500,
        top: 0,
        width: 500,
      } as DOMRect;
    });
    const context = draggable(dom, { dragZone: container });
    const mockOnDragging = jest.fn(() => {});

    if (context) {
      context.on("dragging", mockOnDragging);
      dom.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
      );
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 600, clientY: 600 })
      );
      expect(dom.style.transform).toEqual("translate(500px, 500px)");
    }
  });
});
