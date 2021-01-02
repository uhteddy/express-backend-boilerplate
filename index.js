// Packages
const express = require('express');
const fs = require('file-system');
const path = require('path');
const configFile = require('./config.json');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Initalization
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// Functions
const checkMissingPromise = async(original, check) => {
    return new Promise((resolve, reject) => {
        let missingValues = [];

        for (i = 0; i < check.length; i++) {
            const checkValue = check[i];
            if (!original[checkValue]) {
                missingValues.push(check[i])
            }
        }

        resolve(missingValues)
    })
}

const findDirectory = (directory) => {
    const directoryPath = path.join(__dirname, './routes', directory)
    if (fs.existsSync(directoryPath)) {
        return require(directoryPath)
    } else {
        const indexPath = path.join(__dirname, './routes', directory, 'index.js');
        if (fs.existsSync(indexPath)) {
            return indexPath
        }
    }
}

// Routing Handler
app.all('*', (req, res) => {
    const directory = req.originalUrl.replace(/\?.*$/, '');
    const directoryPath = findDirectory(directory);
    const method = req.method;

    // Local Functions
    const statusError = (errorCode => {
        res.status(errorCode).json({ success: false, response: configFile.ERROR_MESSAGES[errorCode] })
    })

    // Checks to see if the directory path is not undefined
    if (directoryPath) {
        if (directoryPath[method]) { // Checks if the method used is a valid method.
            // The Method Exists, we now need to check the required values.
            const methodPath = directoryPath[method]
            const requirementPath = methodPath["Requirements"];
            const settingsPath = methodPath["Settings"];

            const bodyCheck = checkMissingPromise(req.body, requirementPath["Body"]);
            const headersCheck = checkMissingPromise(req.headers, requirementPath["Headers"]);
            const queryCheck = checkMissingPromise(req.query, requirementPath["Queries"]);
            const cookieCheck = checkMissingPromise(req.cookies, requirementPath["Cookies"]);

            Promise.all([bodyCheck, headersCheck, queryCheck, cookieCheck])
                .then(promiseResponse => {
                    let missingValues = {};

                    // Adding missing values

                    let types = ['body', 'headers', 'queries', 'cookies'];

                    for (type in types) {
                        console.log(types[type])
                        if (promiseResponse[type].length > 0) {
                            missingValues[types[type]] = promiseResponse[type]
                        }
                    }

                    if (Object.keys(missingValues).length > 0) {
                        let showMissingValues = settingsPath["SHOW_MISSING_VALUES"] || true
                        if (showMissingValues) {
                            console.log(missingValues)
                            res.status(422).json({ success: false, message: configFile.ERROR_MESSAGES[422], missing: missingValues })
                        } else {
                            statusError(422);
                        }
                    } else {
                        try {
                            const response = methodPath["Run"](req, res);
                            if (response[1] || response[1] == null) {
                                res.status(200).json({ success: true, response: response[0] })
                            } else {
                                res.status(200).json({ success: false, response: response[0] })
                            }
                        } catch(err) {
                            statusError(500)
                            console.error(err)
                        }
        
                    }
                })
        } else {
            // The Method doesn't exist.
            statusError(405)
        }
    } else {
        // If the directory path is undefined this means that the endpoint does not exist.
        statusError(404)
    }
});

app.listen(configFile.PORT, () => {
    console.log(`Listening on http://127.0.0.1:${configFile.PORT}/`)
})