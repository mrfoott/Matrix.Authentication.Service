// const mongoose = require("mongoose")

// const options = {
//     dbName: 'ecommerce'
// }

// const connection = async () => {
//     try {
//         const mongoURI = `mongodb+srv://mrfoot:${process.env.MONGODB_PASS}@cluster0.2bd3gkz.mongodb.net/?retryWrites=true&w=majority`
//         // console.log(process.env.MONGODB_PASS);
//         // console.log(process.env);
//         await mongoose.connect(mongoURI, options, {})
//         console.log("Connected to MongoDB!!!");

//     } catch (error) {
//         console.log("Failed to connect to MongoDB!!!");
//         console.log(error.message);
//         process.exit(1)
//     }
// }

// const mysql = require("mysql")

// const connection = mysql.createConnection({
//     connectionLimit: 10,
//     port: 3306,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'eccommere_authen'
// });

// connection.connect(function(err) {
//     if (err) {
//         throw err
//     } else {
//         console.log("Connected to database");
//     }
// })

// module.exports = connection