import React, {useLayoutEffect, useState } from 'react';
import rough from "roughjs/bundled/rough.esm";

function  saveToPng() {
  const data = document.getElementById("canvas").toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = data;
  anchor.download = 'image.png';
  anchor.click();
};

function App() {

  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line");
  const [background, setBackground] = useState(null);
  const [elementColor, setColor] = useState('#000');
  
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    // Checking if background is selected
    if (background != null) {
      ctx.drawImage(background, 100, 100, background.width, background.height);
    }
   
    // rendering each element on canvas
    elements.forEach( ({x1, y1, x2, y2, elementType, elementColor}) => {
      
      if (elementType === "line") {
        console.log(elementColor)
        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.strokeStyle = elementColor;

        if ((x2 - x1) > (y2 - y1)) {
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y1);
        } else{
          ctx.lineTo(x1, y1);
          ctx.lineTo(x1, y2);
        }
        
        ctx.stroke();
      } 
      else {
        ctx.beginPath();
        ctx.strokeStyle = elementColor;
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
      }
    })

  }, [elements, background])


  // called when mouse starts moving down
  const handleMouseDown = (event) => {
    setDrawing(true);

    const { clientX, clientY } = event;
    const x1 = clientX;
    const y1 = clientY;
    const x2 = x1;
    const y2 = y1;
    const updatedElement = {x1, y1, x2, y2, elementType, elementColor};
    setElements(prevState => [...prevState, updatedElement]);

  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const x2 = clientX;
    const y2 = clientY;
    const updatedElement = {x1, y1, x2, y2, elementType, elementColor};

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

  function changeColor(event) {
    setColor(event.target.value);
    
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
        <input type="color" id="favcolor" name="favcolor" value="#ff0000" onChange={changeColor}></input>
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
