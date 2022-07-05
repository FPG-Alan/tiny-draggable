import { useEffect, useRef } from "react";
import draggable, { type DragContext } from "tiny-draggable";

function App() {
  const domRef = useRef<HTMLDivElement>(null);
  const dragContextRef = useRef<DragContext | null>(null);

  useEffect(() => {
    console.log("mount");
    if (domRef.current) {
      dragContextRef.current =
        draggable(domRef.current, { holdPosition: true }) ?? null;
    }
    return () => {
      dragContextRef.current?.destroy();
    };
  }, []);

  return (
    <div className="App">
      <div
        style={{
          width: 300,
          height: 300,
          border: "1px solid #eee",
          cursor: "pointer",
        }}
        ref={domRef}
      >
        <p
          style={{
            textAlign: "center",
            lineHeight: "300px",
            margin: 0,
            userSelect: "none",
          }}
        >
          drag me
        </p>
      </div>
    </div>
  );
}

export default App;
