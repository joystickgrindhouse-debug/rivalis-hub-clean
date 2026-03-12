```jsx
import React from "react";

export default function Golf(){

  return (

    <div style={{ padding: "20px", color: "#fff" }}>

      <h1>Rivalis Golf</h1>

      <p>Launching Rivalis Golf...</p>

      <iframe
        src="/golf-app/index.html"
        title="Rivalis Golf"
        style={{
          width: "100%",
          height: "80vh",
          border: "none",
          borderRadius: "12px"
        }}
      />

    </div>

  );

}
```
