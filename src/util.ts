export function createDragDom(sourceDom: HTMLElement): HTMLElement {
  const rect = sourceDom.getBoundingClientRect();
  const dragDom = document.createElement("div");

  dragDom.style.position = "fixed";
  dragDom.style.zIndex = "99999";
  dragDom.style.cursor = "pointer";
  dragDom.style.top = rect.top + "px";
  dragDom.style.left = rect.left + "px";
  dragDom.style.width = rect.width + "px";
  dragDom.style.height = rect.height + "px";
  dragDom.style.overflow = "hidden";

  dragDom.appendChild(sourceDom.cloneNode(true));
  document.getElementsByTagName("body")[0].appendChild(dragDom);

  return dragDom;
}

export class PubSubEvent {
  private eventMap: {
    [key: string]: Array<
      (...args: any[]) => Record<string, unknown> | boolean | void
    >;
  } = {};
  public on(
    eventName: string,
    callback: (...args: any[]) => Record<string, unknown> | boolean | void
  ) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(callback);
  }

  public emit(eventName: string, ...args: any[]) {
    if (this.eventMap[eventName]) {
      let result: Record<string, unknown> | boolean = {};
      this.eventMap[eventName].forEach((callback) => {
        const r = callback(...args);
        if (typeof result === "object" && typeof r === "object" && r) {
          result = { ...result, ...r };
        }

        if (typeof r === "boolean") {
          result = r;
        }
      });

      return result as Record<string, unknown> | boolean;
    }
  }

  public off(eventName?: string) {
    if (eventName) {
      delete this.eventMap[eventName];
    } else {
      this.eventMap = {};
    }
  }
}
