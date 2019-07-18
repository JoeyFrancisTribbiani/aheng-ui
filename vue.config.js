// const path = require('path');

// module.exports = {
//     configureWebpack: {
//         module: {
//             rules: [
//                 {
//                     test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
//                     loader: "url-loader",
//                     // todo: 这种写法有待调整
//                     query: {
//                         limit: 10000,
//                         name: path.posix.join("static", "[name].[hash:7].[ext]")
//                     }
//                 }
//             ]
//         }
//     },
// };
