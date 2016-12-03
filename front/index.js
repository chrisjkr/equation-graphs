/* global io, functionPlot */

var socket = io('http://localhost:3000')

document.getElementById('linearButton').addEventListener('click', function () {
  let data = {
    a: Number(document.getElementById('linearA').value),
    b: Number(document.getElementById('linearB').value)
  }
  socket.emit('linear', data)
})

socket.on('linearResponse', function (data) {
  console.log(data)
})

document.getElementById('quadraticButton').addEventListener('click', function () {
  let data = {
    a: Number(document.getElementById('quadraticA').value),
    b: Number(document.getElementById('quadraticB').value),
    c: Number(document.getElementById('quadraticC').value)
  }
  socket.emit('quadratic', data)
})

socket.on('quadraticResponse', function (data) {
  console.log(data)
})

document.getElementById('cubicButton').addEventListener('click', function () {
  let data = {
    a: Number(document.getElementById('cubicA').value),
    b: Number(document.getElementById('cubicB').value),
    c: Number(document.getElementById('cubicC').value),
    d: Number(document.getElementById('cubicD').value)
  }
  socket.emit('cubic', data)
})

socket.on('cubicResponse', function (data) {
  console.log(data)
})