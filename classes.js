let express=require("express");
let classes=express.Router();
let mysql=require("mysql");
let bodyParser=require("body-parser");
let connection=mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '123456',
    database: 'manage',
    multipleStatements:true
})
connection.connect();
// 查询课程
classes.get("/getClass", function (req,res) {
    let sql="select TID,a.CID,name,credit from tcrelation a left join class b on a.CID=b.CID where TID=?"
    let params=[req.query.TID];
    let json;
    connection.query(sql,params,function (error,result) {
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
// 添加课程
classes.get("/addClass",function (req,res) {
    let sql="insert into class (name,credit) values(?,?);insert into tcrelation (TID,CID) values(?,(select CID from class order by CID desc limit 1))"
    let params=[req.query.name,req.query.credit,req.query.TID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            json = {"error": 0, "msg": "添加成功", "data": []};
        }
        res.json(json)
        res.end();
    })
})
//删除老师的课程（解除老师和课程的关系）
classes.get("/delClass",function (req,res) {
    let sql="delete from tcrelation where CID=? and TID=?"
    let params=[req.query.CID,req.query.TID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            json = {"error": 0, "msg": "删除成功", "data": []};
        }
        res.json(json)
        res.end();
    })
})
// 课程添加学生
let urlencodedParser=bodyParser.urlencoded({extended:false});
classes.post("/addStuToClass",urlencodedParser,function (req,res) {
    let params = req.body.CID;
    let json;
    let sql = "select `order`,general,operate from relation where CID=?";
    connection.query(sql, params, function (error, result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
            res.json(json)
            res.end();
        } else {
            let order = "0";
            let general = "0";
            let operate = "0";
            if (result.length == 0) {

            } else {
                //保持其他学生点名次数相同
                let orderLength = result[0].order.split("#").length;
                let generalLength = result[0].general.split("#").length;
                let operateLength = result[0].operate.split("#").length;
                for (let i = 0; i < orderLength - 1; i++) {
                    order += "#0";
                }
                for (let i = 0; i < generalLength - 1; i++) {
                    general += "#0";
                }
                for (let i = 0; i < operateLength - 1; i++) {
                    operate += "#0";
                }
            }
            params = eval("(" + req.body.SID + ")");
            sql = "insert into relation (SID,CID,`order`,general,operate) values "
            for (let i = 0; i < params.length; i++) {
                sql += "(?," + req.body.CID + ",'" + order + "','" + general + "','" + operate + "'),"
            }
            sql = sql.substring(0, sql.length - 1);
            console.log(sql);
            connection.query(sql, params, function (error, result) {
                if (error) {
                    console.log(error.message)
                    json = {'error': 1, "message": "系统错误", "data": []}
                } else {
                    json = {"error": 0, "msg": "添加成功", "data": []};
                }
                res.json(json)
                res.end();
            })
        }

    })
})
// 课程移除学生
classes.post("/delStuFromClass",urlencodedParser,function (req,res) {
    let json;
    let sql="delete from relation where CID=? and SID in ("+req.body.SID.substring(1,req.body.SID.length-1)+") "
    let params=[req.body.CID];
    console.log(sql);
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message)
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            json = {"error": 0, "msg": "删除成功", "data": []};
        }
        res.json(json)
        res.end();
    })
})
module.exports=classes;
