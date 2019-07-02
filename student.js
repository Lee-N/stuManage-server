let express = require("express");
let student = express.Router();
let mysql = require("mysql");
let connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '123456',
    database: 'manage'
})
connection.connect();
// 获取学生
student.get("/getStudent", function (req, res) {
    let sql = "select * from student ";
    let json;
    connection.query(sql, function (error, result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            json = {"error": 0, "msg": "", "data": result};
        }
        res.json(json)
        res.end();
    })
})


// 添加学生
student.get("/addStudent",function (req,res) {
    let sql="insert into student (name,class,age,sex,phone,major,college) values(?,?,?,?,?,?,?)";
    let params=[req.query.name,req.query.class,req.query.age,req.query.sex,req.query.phone,req.query.major,req.query.college];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {"error": 1, "msg": "系统错误", "data": []};
        } else {
            json = {"error": 0, "msg": "添加成功", "data": []};
        }
        res.json(json)
        res.end();
    })

})


// 删除学生
student.get("/delStudent",function (req,res) {
    let sql="delete  from student where SID=?";
    let params=[req.query.SID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {"error": 1, "msg": "系统错误", "data": []};
        } else {
            json = {"error": 0, "msg": "删除成功", "data": []};
        }
        res.json(json)
        res.end();
    })
})

// 修改学生
student.get("/updateStudent",function (req,res) {
    let sql="update student set name=?,class=?,age=?,sex=?,phone=?,major=?,college=?  where SID=?";
    let params=[req.query.name,req.query.class,req.query.age,req.query.sex,req.query.phone,req.query.major,req.query.college,req.query.SID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {"error": 1, "msg": "系统错误", "data": []};
        } else {
            json = {"error": 0, "msg": "修改成功", "data": []};
        }
        res.json(json)
        res.end();
    })
})
// 根据学号查找学生
student.get("/searchStudent",function (req,res) {
    let sql="select * from student where SID=?";
    let params=[req.query.SID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {"error": 1, "msg": "系统错误", "data": []};
        } else {
            json = {"error": 0, "msg": "查询成功", "data": result};
        }
        res.json(json)
        res.end();
    })
})
module.exports=student;