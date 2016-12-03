var socket = io('http://localhost:3000')

socket.emit('linear', {
  a: 1,
  b: 30
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