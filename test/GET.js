const axios = require('axios');
const expect = require("chai").expect
const route = "http://127.0.0.1:3030/test";

describe("GET Requests", function() {
    it('Returns successful when sending a dataless request.', async function() {
        const response = await axios.get(route)
        expect(response.data.success).to.equal(true)
    })

    it('Returns an error when missing a header value.', async function() {
        axios.get(`${route}/headers`)
            .then(() => {
                throw new Error('was not supposed to succeed.')
            })
            .catch((val) => {
                expect(response.data.success).to.equal(false)
            })
    })
});
