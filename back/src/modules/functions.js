import {log, io} from '../server'

export default class Functions {
  constructor () {
    let that = this // Assign current context to bae able to access class deeper in function
    this.funcHistory = []
    io.on('connection', (socket) => { // Listens for client connections
      log.info('User connected.')

      that.refresh((err) => { // Refresh history for client
        if (err) log.error(err)
        socket.emit('historyResponse', that.funcHistory) // Send history to client
      })

      socket.on('history', () => { // Listen for history requests
        that.refresh((err) => {
          if (err) log.error(err)
          socket.emit('historyResponse', that.funcHistory) // Send history when requested
        })
      })

      socket.on('linear', (data) => { // Listen for linear equation requests
        data = that.linear(data) // Calculate equation
        socket.emit('linearResponse', data) // Send calculated data
        that.save(data, 'linear', (err, func) => { // Save calculated data to database
          if (err) log.error(err)
          that.refresh(() => { // Refresh history
            socket.emit('historyResponse', that.funcHistory) // Send history to client
            io.emit('historyUpdate', that.funcHistory) // Emit history update to all connected clients
          })
        })
      })

      socket.on('quadratic', data => { // Listen for quadratic equation requests
        data = that.quadratic(data) // Calculate
        socket.emit('quadraticResponse', data) // Send
        that.save(data, 'quadratic', (err, func) => { // Save to db
          if (err) log.error(err)
          that.refresh(() => { // Update history
            socket.emit('historyResponse', that.funcHistory) // Send history
            io.emit('historyUpdate', that.funcHistory) // Send history to all clients
          })
        })
      })

      socket.on('cubic', data => { // Listen for cubic equation requests
        data = that.cubic(data) // Calculate
        socket.emit('cubicResponse', data) // Send
        that.save(data, 'cubic', (err, func) => { // Save
          if (err) log.error(err)
          that.refresh(() => { // Update history
            socket.emit('historyResponse', that.funcHistory) // Send history
            io.emit('historyUpdate', that.funcHistory) // Send to everyone
          })
        })
      })

      socket.on('disconnect', () => { // Runs when client disconnects
        log.info('User disconnected.')
      })
    })
  }

  linear (data) {
    const a = data.a ? data.a : 0
    const b = data.b ? data.b : 0

    if (!a) return false // Exit when a is 0

    return { // Return result
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

    if (!a) return that.linear({ // Treat function as linear
      a: b,
      b: c
    })

    let delta = Math.pow(b, 2) - 4 * a * c
    if (delta > 0) { // Return 2 roots
      return {
        a: a,
        b: b,
        c: c,
        x: (-b - Math.sqrt(delta)) / (2 * a),
        x2: (-b + Math.sqrt(delta)) / (2 * a)
      }
    } else if (delta === 0) { // Return 1 root
      return {
        a: a,
        b: b,
        c: c,
        x: -b / (2 * a)
      }
    }

    return false // When delta is less than 0
  }

  cubic (data) {
    let that = this
    let a = data.a ? data.a : 0
    let b = data.b ? data.b : 0
    let c = data.c ? data.c : 0
    let d = data.d ? data.d : 0

    if (!a) return that.quadratic({ // Treat function as quadratic
      a: b,
      b: c,
      c: d
    })

    // Convert to depressed cubic
    let p = (3*a*c - b*b)/(3*a*a)
    let q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a)
    let roots

    if (!p) {
      roots = [cubeRoot(-q)]
    } else if (!q) {
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []) // If p is less than 0, return 2 roots
    } else {
      let delta = q*q/4 + p*p*p/27
      if (!delta) {       // 2 roots
        roots = [-1.5*q/p, 3*q/p]
      } else if (delta > 0) { // 1 root
        let u = cubeRoot(-q/2 - Math.sqrt(delta))
        roots = [u - p/(3*u)]
      } else { // D < 0, three roots
        let u = 2*Math.sqrt(-p/3)
        let t = Math.acos(3*q/p/u)/3
        let k = 2*Math.PI/3
        roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)]
      }
    }

    for (let i = 0; i < roots.length; i++) // Convert back from depressed cubic
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
        x: roots[0],
        x2: roots[1]
      }
    if (roots.length === 3) return {
      a: a,
      b: b,
      c: c,
      d: d,
      x: roots[0],
      x2: roots[1],
      x3: roots[2],
    }

    function cubeRoot(x) {
      let y = Math.pow(Math.abs(x), 1/3)
      return x < 0 ? -y : y
    }
  }

  save (data, type, done) {
    let hasRoots = !(typeof data.x === 'number' && typeof data.x2 === 'number' && typeof data.x3 === 'number')
    let func = new MFunction({ // Create new document object
      type: type,
      a: data.a ? data.a : 0,
      b: data.b ? data.b : 0,
      c: data.c ? data.c : 0,
      d: data.d ? data.d : 0,
      hasRoots: hasRoots,
      x: typeof data.x === 'number' ? data.x : null,
      x2: typeof data.x2 === 'number' ? data.x2 : null,
      x3: typeof data.x3 === 'number' ? data.x3 : null
    })
    func.save(function (err) { // Save document to database
      if (err) return done(err)

      return done(null, func) // Return callback
    })
  }

  refresh (done) {
    let that = this
    MFunction.find({}).sort({ timestamp: -1 }).exec(function (err, functions) { // Get all functions from
                                                                                // database and sort
      if (err) return done(err)                                                 // from newest

      if (functions.length < 1) return done({
        msg: 'No data'
      })

      return done(that.funcHistory = functions) // Return callback with history array and assign
    })                                          // to class variable
  }
}