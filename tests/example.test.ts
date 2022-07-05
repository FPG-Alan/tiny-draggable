import { makeDraggable } from "../src";

describe("tiny-draggable:makeDraggable", () => {
  test("makeDraggable(): return undefined when dom had `DRAGGABLE_FLAG` as attribute", () => {
    const dom = document.createElement("div");
    makeDraggable(dom);
    expect(makeDraggable(dom)).toBe(undefined);
  });
});
