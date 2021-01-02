module.exports = {
    "GET": {
        Requirements: {
            Headers: [],
            Queries: [],
            Cookies: [],
            Body: []
        },
        Settings: {
            "SHOW_MISSING_VALUES": false, // If this is true it will return a table of missing header, query, and cookie data that's required in the text.
        },
        Run: (req, res) => {
            return { hello: true }
        }
    },
    "POST": {
        Requirements: {
            Headers: [],
            Queries: [],
            Cookies: [],
            Body: ["msg", "username"]
        },
        Settings: {
            "SHOW_MISSING_VALUES": true, // If this is true it will return a table of missing header, query, and cookie data that's required in the text.
        },
        Run: (req, res) => {
            return [{ hello: true }, false]
        }
    }
}
