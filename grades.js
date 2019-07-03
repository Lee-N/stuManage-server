let express=require("express");
let grades=express.Router();
let mysql=require("mysql");
let bodyParser=require("body-parser");
let urlencodedParser=bodyParser.urlencoded({extended:false});
let connection=mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '123456',
    database: 'manage',
});
connection.connect();

// 查询课程所有学生成绩
grades.get("/getGrades",function (req,res) {
    let sql="select * from relation a LEFT JOIN student b on a.SID=b.SID where CID=?";
    let params=[req.query.CID];
    let json;
    connection.query(sql,params,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            for(let i=0;i<result.length;i++){
                result[i].order=result[i].order.split("#");
                result[i].general=result[i].general.split("#");
                result[i].operate=result[i].operate.split("#");
            }
            json = {"error": 0, "msg": "", "data": result};
        }
        res.json(json);
        res.end();
    })
});

// 更新学生成绩 全程字符串拼接我是真的呆 为什么params会加引号呢
grades.post("/updateGrade",urlencodedParser,function (req,res) {
    let data=JSON.parse(req.body.data).data;
    //成绩类型（order,general,operate）
    let type=JSON.parse(req.body.data).type;
    let sql="update relation set `"+type+"`= case SID ";
    let SIDstr="";//学生ID集合字符串
    let gradeStr="";//一种成绩字符串拼接
    let gradesStr="";//总成绩字符串拼接
    let json;
    //console.log(data);
    // 计算总成绩
    for(let i=0;i<data.length;i++){
        let order=eval(data[i].order.join("+"))/data[i].order.length;
        let general=eval(data[i].general.join("+"))/data[i].general.length;
        let operate=eval(data[i].operate.join("+"))/data[i].operate.length;
        let grade=order*0.2+general*0.3+operate*0.5;
        //console.log(data[i]);
        gradeStr+=" when '"+data[i].SID+"' then '"+data[i][type].toString().replace(/,/g,"#")+"' ";//将成绩数组转化为100#100的拼接
        gradesStr+=" when '"+data[i].SID+"' then '"+grade+"' ";
        //sql+=" when '"+data[i].SID+"' then '"+gradeStr+"'";
        SIDstr+=data[i].SID+","
    }
    sql+=gradeStr+" end, grade= case SID "+gradesStr;
    SIDstr=SIDstr.substring(0,SIDstr.length-1);
    sql+=" end where SID in ("+SIDstr+")";
    sql+=" and CID="+data[0].CID;
    console.log(sql);
    connection.query(sql,function (error,result) {
        if (error) {
            console.log(error.message);
            json = {'error': 1, "message": "系统错误", "data": []}
        } else {
            json = {"error": 0, "msg": "修改成功", "data": []};
        }
        res.json(json);
        res.end();
    })
});
module.exports=grades;