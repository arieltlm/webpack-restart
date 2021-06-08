import './style.css'
import svgCanvas from './images/svg-canvas.png';
import printMe from './print.js'

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button')
  
    element.innerHTML = 'Hello webpack';
    element.classList.add('hello');

    var myImg = new Image()
    myImg.src = svgCanvas
    
    element.appendChild(myImg)

    btn.innerHTML = '点击这里，然后查看 console！';
    btn.onclick = printMe;

    element.appendChild(btn);
  
    return element;
  }
  
  document.body.appendChild(component());