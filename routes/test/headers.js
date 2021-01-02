module.exports = {
    "GET": {
        Requirements: {
            Headers: ["test"],
            Queries: [],
            Cookies: [],
            Body: []
        },
        Run: (req, res) => {
            return { hello: true }
        }
    }
}
