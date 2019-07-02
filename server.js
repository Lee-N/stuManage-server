let express = require("express");
let app = new express();
let logReg=require("./LogReg");
let student=require("./student");
let classes=require("./classes")
let grades=require("./grades")
app.use(logReg);
app.use(student);
app.use(classes);
app.use(grades);
let server = app.listen(8888, function () {
    console.log(server.address().address + server.address().port);
})