var socket = io('http://localhost:3000')

socket.emit('quadratic', {
  a: 1,
  b: 10,
  c: 3
})

socket.on('quadraticResponse', function (data) {
  console.log(data)
})