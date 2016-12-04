/* global io, d3 */

var socket = io('http://localhost:3000')

document.getElementById('linearButton').addEventListener('click', function () {
  var data = {
    a: Number(document.getElementById('linearA').value),
    b: Number(document.getElementById('linearB').value)
  }
  socket.emit('linear', data)

  var dataset = []
  for (var x = 1; x <= 100; x++) {
    dataset.push({
      x: x,
      y: data.a * x + data.b
    })
  }
  console.log(dataset)

  var svg = d3.select('#linear')
    .append('svg')
    .attr('width', 400)
    .attr('height', 300)

  var margin = {top: 20, right: 20, bottom: 20, left: 20}
  var w = +svg.attr('width') - margin.left - margin.right
  var h = +svg.attr('height') - margin.top - margin.bottom
  var g = svg.append('g').attr({
    transform: 'translate(' + margin.left + ',' + margin.top + ')',
    border: '1px solid black'
  })

  var x = d3.scaleLinear()
    .rangeRound([0, w])
  var y = d3.scaleLinear()
    .rangeRound([h, 0])

  var line = d3.line()
    .x(function (d) { return x(d.x)})
    .y(function (d) { return y(d.y) })

  x.domain(d3.extent(dataset, function (d) { return d.x }))
  y.domain(d3.extent(dataset, function (d) { return d.y }))

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .style('text-anchor', 'end')
    .text('Price ($)')

  g.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)
})

socket.on('linearResponse', function (data) {
  console.log(data)
})

document.getElementById('quadraticButton').addEventListener('click', function () {
  var data = {
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
  var data = {
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