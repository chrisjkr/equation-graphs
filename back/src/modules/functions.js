import {log, io} from '../server'

export default class Functions {
  constructor () {
    let that = this
    io.on('connection', (socket) => {
      log.info('User connected.')

      socket.on('quadratic', function (data) {
        socket.emit('quadraticResponse', that.quadratic(data))
      })

      socket.on('disconnect', function () {
        log.info('User disconnected.')
      })
    })
  }

  linear (a, b) {

  }

  quadratic (data) {
    const a = data.a ? data.a : 0
    const b = data.b ? data.b : 0
    const c = data.c ? data.c : 0

    let delta = Math.pow(b, 2) - 4 * a * c
    if (delta > 0) {
      return {
        x1: (-b - Math.sqrt(delta)) / (2 * a),
        x2: (-b + Math.sqrt(delta)) / (2 * a)
      }
    } else if (delta === 0) {
      return -b / (2 * a)
    } else {
      return false
    }
  }
}