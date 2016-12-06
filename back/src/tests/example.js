import should from 'should'
import sinon from 'sinon'

describe('Example component tests: ', function () {
    describe('Status', function () {
        it('should return status code 200 and message "OK"', function () {
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            
            let Example = require('./example/function.js')
            Example = new Example()
            
            Example.status(null, res)
            
            res.status.calledWith(200).should.equal(true, 'Bad status' + res.status.args[0][0])
            res.send.calledWith('OK').should.equal(true, 'Wrong message' + res.send.args[0][0])
        })
    })
})