const axios = require('axios');
const route = "http://127.0.0.1:3030/tests"

describe("Requests", function() {
    it('should return successful', function() {
        axios.get(route)
            .then(response => {
                expect(response.succes).to.be.true
            })
    })

    it('should return an error', function() {
        axios.get(route)
            .then(response => {
                expect(response.succes).to.be.true
            })
    })
});