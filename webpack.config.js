const path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'output/LN'),
        filename: "LN_LabelPrint.js"
    }
}