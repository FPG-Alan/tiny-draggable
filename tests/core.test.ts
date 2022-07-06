/* eslint-disable @typescript-eslint/no-empty-function */
import { makeDraggable } from "../src";

describe("tiny-draggable:core", () => {
  test("return context after make draggable", () => {
    const dom = document.createElement("div");
    const context = makeDraggable(dom);
    expect(context).toBeDefined();
  });
  test("return undefined when dom had `DRAGGABLE_FLAG` as attribute", () => {
    const dom = document.createElement("div");
    makeDraggable(dom);
    expect(makeDraggable(dom)).toBeUndefined();
  });

  // -------------------------LIFE TIME CALLBACKS-------------------------
  test("life time callback - beforeDrag", () => {
    const dom = document.createElement("div");
    const mockOnBeforeDrag = jest.fn(() => {});
    const context = makeDraggable(dom);
    if (context) {
      context.on("beforeDrag", mockOnBeforeDrag);
    }
    dom.dispatchEvent(new MouseEvent("mousedown"));
    expect(mockOnBeforeDrag).toHaveBeenCalled();
  });

  test("life time callback - dragStart", () => {
    const dom = document.createElement("div");
    const mockOnDragStart = jest.fn(() => {});
    const context = makeDraggable(dom);
    if (context) {
      context.on("dragStart", mockOnDragStart);
    }
    dom.dispatchEvent(new MouseEvent("mousedown"));

    setTimeout(() => {
      window.dispatchEvent(new MouseEvent("mousemove"));
      expect(mockOnDragStart).toHaveBeenCalled();
    }, 100);
  });

  test("life time callback - dragging", () => {
    const dom = document.createElement("div");

    const mockOnDragging = jest.fn(() => {});

    const context = makeDraggable(dom);
    if (context) {
      context.on("dragging", mockOnDragging);
    }
    dom.dispatchEvent(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));
    setTimeout(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 100, clientY: 100 })
      );
      expect(mockOnDragging).toHaveBeenCalled();
    }, 100);
  });

  test("life time callback - dragEnd", () => {
    const dom = document.createElement("div");

    const mockOnDraggEnd = jest.fn(() => {});

    const context = makeDraggable(dom);
    if (context) {
      context.on("dragEnd", mockOnDraggEnd);
    }
    dom.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(new MouseEvent("mousemove"));
    setTimeout(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
      expect(mockOnDraggEnd).toHaveBeenCalled();
    }, 100);
  });

  test("life time callback - click", () => {
    const dom = document.createElement("div");
    const mockOnClick = jest.fn(() => {});
    const context = makeDraggable(dom);
    if (context) {
      context.on("click", mockOnClick);
    }
    dom.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(new MouseEvent("mousemove"));
    setTimeout(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
      expect(mockOnClick).toHaveBeenCalled();
    }, 100);
  });
  // ---------------------------------------------------------------------

  // -----------------------------OPTIONS---------------------------------
  test("options - axis - none", () => {
    const dom = document.createElement("div");
    const mockDragging = jest.fn(() => {});
    const context = makeDraggable(dom, { axis: "none" });
    if (context) {
      context.on("dragging", mockDragging);

      dom.dispatchEvent(new MouseEvent("mousedown"));
      window.dispatchEvent(new MouseEvent("mousemove"));

      expect(mockDragging).not.toHaveBeenCalled();
    }
  });

  test("options - axis - x", () => {
    const dom = document.createElement("div");
    const mockDragging = jest.fn(() => {});
    const context = makeDraggable(dom, { axis: "x" });
    if (context) {
      context.on("dragging", mockDragging);

      dom.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
      );
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 0, clientY: 100 })
      );

      expect(mockDragging).not.toHaveBeenCalled();
    }
  });

  test("options - axis - y", () => {
    const dom = document.createElement("div");
    const mockDragging = jest.fn(() => {});
    const context = makeDraggable(dom, { axis: "x" });
    if (context) {
      context.on("dragging", mockDragging);

      dom.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
      );
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 100, clientY: 0 })
      );

      expect(mockDragging).not.toHaveBeenCalled();
    }
  });

  // ---------------------------------------------------------------------
  test("modify drag data during life-time correctly", () => {
    const dom = document.createElement("div");

    const mockOnBeforeDrag = jest.fn(() => {
      return { test: true };
    });
    const mockOnStartDrag = jest.fn(() => {});
    const context = makeDraggable(dom);
    if (context) {
      context.on("beforeDrag", mockOnBeforeDrag);
      context.on("dragStart", mockOnStartDrag);

      dom.dispatchEvent(new MouseEvent("mousedown"));

      setTimeout(() => {
        window.dispatchEvent(new MouseEvent("mousemove"));
        // @ts-ignore
        expect(mockOnBeforeDrag?.mock?.calls?.[0][0]["test"]).toBe(true);
      }, 100);
    }
  });

  test("destory", () => {
    const dom = document.createElement("div");
    const mockOnBeforeDrag = jest.fn(() => {});
    const context = makeDraggable(dom);
    if (context) {
      context.on("beforeDrag", mockOnBeforeDrag);
      context.destroy();
      dom.dispatchEvent(new MouseEvent("mousedown"));
      expect(mockOnBeforeDrag).not.toHaveBeenCalled();
    }
  });
});
