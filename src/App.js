import React, {useLayoutEffect, useState } from 'react';
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function drawElement(x1, y1, x2, y2, type) {
  var roughElement = null;
  if (type === "line") roughElement = generator.line(x1, y1, x2, y2);
  else roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, roughElement };
}

function  saveToPng() {
  window.location = document.getElementById("canvas").toDataURL('image/png');
};

function App() {

  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line");
  const [background, setBackground] = useState(null);
  
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d")
    
    if (background != null) {
      canvas.width = background.width;
      canvas.height = background.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (background != null) {
      ctx.drawImage(background, 100, 100, background.width * .5, background.height* .5);
    }
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement))

  }, [elements, background])

  const handleMouseDown = (event) => {
    setDrawing(true);

    const { clientX, clientY } = event;
    const updatedElement = drawElement(clientX, clientY, clientX, clientY, elementType);
    setElements(prevState => [...prevState, updatedElement])

  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = drawElement(x1, y1, clientX, clientY, elementType);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);

    console.log(clientX, clientY);
  };

  const handleMouseUp = (event) => {
    setDrawing(false);
  };

  function loadImageTocanvas(url) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d")
    var img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setBackground(img);
      setElements([]);
      setDrawing(false);
      setElementType("line");
    }
    img.src = url;
  }

  function loadCanvasWithInputFile(event) {
    
    var files = event.target.files; // FileList object
    if (files.length === 0) return;
    var file = files[0];

    console.log(file)
    
    if (!file.type.match('image.*')) {
      alert("Not Image file")
      return;
    }

    const window_URL = window.URL || window.webkitURL;

    var imageURL = window_URL.createObjectURL(file);
    loadImageTocanvas(imageURL);
}

  return (
    <div className="App">
      <div id="navbar"
        style={{
          position: 'fixed',
          padding: '5px',
          width: '100%',
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}
      >
        <div className="checkbox-select">
          <input type="radio"
            id="line"
            checked={elementType === "line"}
            onChange={() => setElementType("line")}>
          </input>
          <label htmlFor="line">
            Line
        </label>
          <input type="radio"
            id="rectangle"
            checked={elementType === "rectangle"}
            onChange={() => { setElementType("rectangle") }}
          >
          </input>
          <label
            htmlFor="rectangle"
          >Rectangle</label>
        </div>
        <input type="file"
          id="file-select"
          onChange={loadCanvasWithInputFile}
        >
        </input>
        <input type="button" id="save" value="Save to PNG" onClick={saveToPng}></input>
      </div>
      <canvas id="canvas"
        style={{ padding: '10px' }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}>
        Canvas
      </canvas>
    </div>
  );
}

export default App;
