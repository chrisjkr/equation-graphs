import {log, io} from '../server'

export default class Functions {
  constructor () {
    let that = this
    io.on('connection', (socket) => {
      log.info('User connected.')

      socket.on('linear', function (data) {
        socket.emit('linearResponse', that.linear(data))
      })

      socket.on('quadratic', function (data) {
        socket.emit('quadraticResponse', that.quadratic(data))
      })

      socket.on('cubic', function (data) {
        socket.emit('cubicResponse', that.cubic(data))
      })

      socket.on('disconnect', function () {
        log.info('User disconnected.')
      })
    })
  }

  linear (data) {
    const a = data.a ? data.a : 0
    const b = data.b ? data.b : 0

    if (!a) return false

    return {
      a: a,
      b: b,
      x: -b / a
    }
  }

  quadratic (data) {
    let that = this
    const a = data.a ? data.a : 0
    const b = data.b ? data.b : 0
    const c = data.c ? data.c : 0

    if (!a) that.linear({
      a: b,
      b: c
    })

    let delta = Math.pow(b, 2) - 4 * a * c
    if (delta > 0) {
      return {
        a: a,
        b: b,
        c: c,
        x1: (-b - Math.sqrt(delta)) / (2 * a),
        x2: (-b + Math.sqrt(delta)) / (2 * a)
      }
    } else if (delta === 0) {
      return {
        a: a,
        b: b,
        c: c,
        x: -b / (2 * a)
      }
    }

    return false
  }

  cubic (data) {
    let that = this
    let a = data.a ? data.a : 0
    let b = data.b ? data.b : 0
    let c = data.c ? data.c : 0
    let d = data.d ? data.d : 0

    if (!a) that.quadratic({
      a: b,
      b: c,
      c: d
    })

    // Convert to depressed cubic
    let p = (3*a*c - b*b)/(3*a*a)
    let q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a)
    let roots

    if (!p) { // p = 0 -> t^3 = -q -> t = -q^1/3
      roots = [cubeRoot(-q)]
    } else if (!q) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : [])
    } else {
      let delta = q*q/4 + p*p*p/27
      if (!delta) {       // D = 0 -> two roots
        roots = [-1.5*q/p, 3*q/p]
      } else if (delta > 0) {             // Only one real root
        let u = cubeRoot(-q/2 - Math.sqrt(delta))
        roots = [u - p/(3*u)]
      } else {                        // D < 0, three roots
        let u = 2*Math.sqrt(-p/3)
        let t = Math.acos(3*q/p/u)/3
        let k = 2*Math.PI/3
        roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)]
      }
    }

    // Convert back from depressed cubic
    for (let i = 0; i < roots.length; i++)
      roots[i] -= b/(3*a)


    if (roots.length === 1) return {
      a: a,
      b: b,
      c: c,
      d: d,
      x: roots[0]
    }
    if (roots.length === 2)return {
        a: a,
        b: b,
        c: c,
        d: d,
        x1: roots[0],
        x2: roots[1]
      }
    if (roots.length === 3) return {
      a: a,
      b: b,
      c: c,
      d: d,
      x1: roots[0],
      x2: roots[1],
      x3: roots[2],
    }

    function cubeRoot(x) {
      var y = Math.pow(Math.abs(x), 1/3)
      return x < 0 ? -y : y
    }
  }
}