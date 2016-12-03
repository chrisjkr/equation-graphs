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

socket.emit('quadratic', {
  a: 1,
  b: 10,
  c: 3
})

socket.on('quadraticResponse', function (data) {
  console.log(data)
})

socket.emit('cubic', {
  a: 1,
  b: -4,
  c: 1,
  d: 6
})

socket.on('cubicResponse', function (data) {
  console.log(data)
})