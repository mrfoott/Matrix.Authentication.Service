const db = require("../connectionDB")
const { v4: uuidv4 } = require('uuid')

const User = {
    //AUTHENTICATION

    registerUser: (user, callback) => {
        const id = uuidv4();
        const sql = `INSERT INTO user (id, email, password, role_id) 
                    VALUES ('${id}', '${user.email}', '${user.password}', 0)`
        
        return db.query(sql, callback)
    },
    loginUser: (user, callback) => {
        const sql = `SELECT * FROM user 
                    WHERE email = '${user.email}'`
        // console.log(user);
        return db.query(sql, callback)
    },
    forgotPasswordUser: (user, callback) => {
        const sql = `UPDATE user
                    SET password = '${user.password}'
                    WHERE id = '${user.id}'`
        return db.query(sql, callback)
    },

    //GET
    GET: {

    },

    //POST
    POST: {

    },

    //PUT
    PUT: {
        
    },
}

module.exports = User