let express=require("express");
let mysql = require("mysql");
let logReg=express.Router();
let connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '123456',
    database: 'manage'
})
connection.connect();
// 登录
logReg.get("/login", function (req, res) {
    let sql = "select * from teacher where TID=? and password=?";
    let params = [req.query.TID, req.query.password];
    let json;
    connection.query(sql, params, function (error, result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
        } else if (result.length == 0) {
            console.log("用户名密码错误");
            json = {"error": 2, "msg": "用户名密码错误", "data": []};
        } else {
            json = {"error": 0, "msg": "", "data": result};
        }
        res.json(json)
        res.end();
    })
})
// 注册
logReg.get('/register', function (req, res) {
    let sql = "insert into teacher (name,password) values(?,?)"
    let params = [req.query.name, req.query.password];
    connection.query(sql, params, function (error, result) {
        let json;
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
            res.json(json)
            res.end();
        } else {
            sql = "select * from teacher order by TID desc limit 1";
            params = [req.query.name, req.query.password];
            connection.query(sql, params, function (error, result) {
                if (error) {
                    console.log(error.message)
                    json = {'error': 1, "message": "系统错误", "data": []}
                } else {
                    console.log(result);
                    json = {"error": 0, "msg": "", "data": result};
                }
                res.json(json)
                res.end();
            })
        }
    })

})
module.exports=logReg;