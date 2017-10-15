var webpack = require("webpack");
var path = require("path");

var DIST_PATH = path.resolve(__dirname,"out");
var SRC_PATH = path.resolve(__dirname,"src");

var config = {
    entry: SRC_PATH + "/app/index.jsx",
    output:{
        path: DIST_PATH + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    devServer:{
        historyApiFallback : true,
    },
    module:{
        loaders: [
            {
                test:/\.jsx?/,
                include: SRC_PATH,
                loader: "babel-loader",
				exclude: /node_modules/,
                query:{
                    presets:["react","es2015","stage-2"]
                }
            },

            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    }
};

module.exports  = config;
