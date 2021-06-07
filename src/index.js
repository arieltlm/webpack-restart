import './style.css'
import svgCanvas from './images/svg-canvas.png';

function component() {
    let element = document.createElement('div');
  
    element.innerHTML = 'Hello webpack';
    element.classList.add('hello');

    var myImg = new Image()
    myImg.src = svgCanvas
    
    element.appendChild(myImg)
  
    return element;
  }
  
  document.body.appendChild(component());