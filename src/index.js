import './style.css'
import svgCanvas from './images/svg-canvas.png';
import printMe from './print.js'
import data from './test.xml'
import data1 from './test1.xml'
import example from './example.txt'

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button')
  
    element.innerHTML = 'Hello webpack 1';
    element.classList.add('hello');

    var myImg = new Image()
    myImg.src = svgCanvas
    
    element.appendChild(myImg)

    console.log('%c example===', 'color:#497EFC;background: #03FECF;', example) // Hey Tom

    
    btn.innerHTML = '点击这里，然后查看1 cosole！';
    btn.onclick = printMe;

    element.appendChild(btn);
  
    return element;
  }

  function xmlEle() {
    var elementxml = document.createElement('div');
    elementxml.innerHTML = data.note.body;

    return elementxml
  }
  function xmlEle1() {
    var elementxml = document.createElement('div');
    elementxml.innerHTML = data1.note.heading;

    return elementxml
  }  
  document.body.appendChild(xmlEle());
  document.body.appendChild(xmlEle1());
  document.body.appendChild(component());

