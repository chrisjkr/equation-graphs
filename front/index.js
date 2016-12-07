/* global io, functionPlot */

var socket = io('http://localhost:3000')

document.getElementById('linearButton').addEventListener('click', function () {
  var data = {
    a: Number(document.getElementById('linearA').value),
    b: Number(document.getElementById('linearB').value)
  }
  socket.emit('linear', data)
})

socket.on('linearResponse', function (data) {
  console.log(data)

  functionPlot({
    target: '#linear',
    data: [{
      fn: data.a + 'x + ' + data.b
    }]
  })
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

  functionPlot({
    target: '#quadratic',
    data: [{
      fn: data.a + 'x^2 + ' + data.b + 'x + ' + data.c
    }]
  })
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

  functionPlot({
    target: '#cubic',
    data: [{
      fn: data.a + 'x^3 + ' + data.b + 'x^2 + ' + data.c + 'x + ' + data.d
    }]
  })
})

socket.emit('history')
socket.on('historyResponse', function (funcHistory) {
  console.log(funcHistory)

  var tableBody = ''
  funcHistory.forEach(function (func) {
    var hasRoots = func.hasRoots ? 'yes' : 'no'
    tableBody += '<tr></tr><td>' + humanizeDate(func.timestamp) + '</td>' +
      '<td>' + func.type + '</td>' +
      '<td>' + hasRoots + '</td>' +
      '<td>' + func.a + '</td>' +
      '<td>' + func.b + '</td>' +
      '<td>' + func.c + '</td>' +
      '<td>' + func.d + '</td>' +
      '<td>' + func.x + '</td>' +
      '<td>' + func.x2 + '</td>' +
      '<td>' + func.x3 + '</td></tr>'
  })

  document.getElementById('functionHistory').innerHTML = tableBody
})

function humanizeDate (date) {
  date = new Date(date)
  var elapsed = Math.round((+new Date - date.getTime()) / 1000)

  var minute = 60
  var hour = minute * 60
  var day = hour * 24
  var month = day * 30
  var year = month * 12

  if (elapsed < 60) return 'Just now.'
  else if (elapsed < 2 * minute) return 'A minute ago'
  else if (elapsed < hour) return Math.floor(elapsed / minute) + ' minutes ago'
  else if (elapsed < 24 * hour) {
    elapsed = Math.floor(elapsed / hour)
    if (elapsed === 1) return elapsed + ' hour ago'
    else return elapsed + ' hours ago'
  }
  else if (elapsed < month) return Math.floor(elapsed / day) + ' days ago'
  else if (elapsed < year) return Math.floor(elapsed / month) + ' months ago'
  else if (elapsed >= year) {
    elapsed = Math.floor(elapsed / year)
    if (elapsed === 1) return 'A year ago'
    else return elapsed + ' years ago'
  }
  else return false
}