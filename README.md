![build](https://github.com/FPG-Alan/tiny-draggable>/actions/workflows/build/badge.svg)

# Tiny Draggable

Make dom draggable via mouse events, with small file size and simple to use.

# Usage

## install

TBD...

## draggable

```ts
import draggable from "tiny-draggable";

const dom = document.getElementById("make-me-draggable");
draggable(dom);
```

## draggable options

```ts
  /**
   * response to dragging on each axis
   */
  axis?: "both" | "x" | "y" | "none";
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
```

## more flexibility

User can import core of draggable directly to get more flexibility, `function draggable` use it underhood.

```ts
import { makeDraggable, DRAGGABLE_FLAG } from "tiny-draggable";

const dom = document.getElementById("make-me-draggable");

if (dom && !dom.getAttribute(DRAGGABLE_FLAG)) {
  const context = makeDraggable(slice.stateNode);

  if (context) {
    context.on("beforeDrag", (data, e) => {
      //...
    });
    context.on("dragStart", (data, e) => {
      //...
    });
    context.on("dragging", (data, e) => {
      //...
    });
    context.on("dragEnd", (data, e) => {
      //...
    });
  }
}
```

## use tiny-draggable in React

simply create a React hook:

```tsx
import draggable, { type DraggableOptions, DragContext } from "tiny-draggable";

function useDraggable(
  options: DraggableOptions
): [
  MutableRefObject<any | null>,
  MutableRefObject<DragContext | null>,
  boolean
] {
  const [mount, setMount] = useState(true);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<any>(null);

  const contextRef = useRef<DragContext | null>(null);

  useEffect(() => {
    if (ref.current && ref.current instanceof HTMLElement) {
      const context = draggable(ref.current, options);

      if (context) {
        contextRef.current = context;

        context.on("dragStart", () => {
          if (mount) {
            setDragging(true);
          }
        });
        context.on("dragEnd", () => {
          if (mount) {
            setDragging(false);
          }
        });
      }
    }
  }, [ref.current]);

  useEffect(() => {
    return () => {
      if (contextRef.current) {
        contextRef.current.destroy();
      }

      setMount(false);
    };
  }, []);

  return [ref, contextRef, dragging];
}

function Example() {
  const [ref, contextRef, dragging] = useDraggable();

  return (
    <div>
      <p ref={ref}>draggable me</p>
    </div>
  );
}
```

# Running example

To run the example project locally, run the commands:

```sh
cd example
pnpm run dev
```

# Test

```
pnpm run test

```
