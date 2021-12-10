const http = require("http");
const fs = require("fs");
const url = require("url");
const rpcWSS = require("rpc-websockets").Server;

const filename = "./StudentList.json";

try {
  fs.watch(filename, (event, f) => {
    if (f) server.emit("File changed", { file: f, event: event });
  });
} catch (e) {
  console.log("catch e = ", e.code);
}

http
  .createServer((req, res) => {
    switch (req.method) {
      case "GET":
        GETHandler(req, res);
        break;
      case "POST":
        POSTHandler(req, res);
        break;
      case "PUT":
        PUTHandler(req, res);
        break;
      case "DELETE":
        DELETEHandler(req, res);
        break;
    }
  })
  .listen(5000, () => {
    console.log("Server is running");
  });

function GETHandler(req, res) {
  switch (url.parse(req.url).pathname) {
    case "/":
      fs.readFile(filename, (e, data) => {
        if (e) {
          server.emit("Error", {
            shortMsg: "File read error",
            fullMsg: e.message,
          });
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<h1>File read error: ${e}</h1>`);
          return null;
        } else {
          if (data != null) {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8",
            });
            res.end(data);
          }
        }
      });

      break;
    case "/backup":
      fs.readdir('.',{withFileTypes:true},(err, files)=>{
        if(err) console.log('Error ',e);
        else{
          let fnames = [];
          files.forEach((f)=>{
            if(RegExp(/^\d{4}\d{2}\d{2}([0-1][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])_StudentList\.json$/).test(f.name)){
              fnames.push(f.name);
            }
          })
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify(fnames));
        }
      })
      break;
    default:
      if (RegExp(/^\/[0-9]+/).test(url.parse(req.url).pathname)) {
        fs.readFile("./StudentList.json", (e, data) => {
          if (e) {
            server.emit("Error", {
              shortMsg: "File read error",
              fullMsg: e.message,
            });
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end(`<h1>File read error: ${e}</h1>`);
          } else {
            let students = JSON.parse(data.toString("utf-8"));
            let student = null;
            let searchId = url.parse(req.url).pathname.split("/")[1];
            students.forEach((s) => {
              if (s.id == searchId) {
                student = s;
              }
            });
            if (student == null) {
              server.emit("Error", {
                shortMsg: "Student not found",
                fullMsg: `Student with id=${searchId} not found`,
              });
              res.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end(`<h1>Student not found</h1>`);
            } else {
              res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
              });
              res.end(JSON.stringify(student));
            }
          }
        });
      } else {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Bad request</h1>`);
      }
      break;
  }
}

function POSTHandler(req, res) {
  switch (url.parse(req.url).pathname) {
    case "/":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString("utf-8");
      });
      req.on("end", () => {
        let newStudent = JSON.parse(body);
        if (!isNaN(Number(newStudent.id))) {
          fs.readFile("./StudentList.json", (e, data) => {
            if (e) {
              server.emit("Error", {
                shortMsg: "File read error",
                fullMsg: e.message,
              });
              res.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end(`<h1>File read error: ${e}</h1>`);
            } else {
              let studentFound = false;
              if (data != null) {
                let students = JSON.parse(data.toString("utf-8"));
                students.forEach((s) => {
                  if (s.id == newStudent.id) {
                    server.emit("Error", {
                      shortMsg: "Student already in database",
                      fullMsg: `Student with id=${newStudent.id} already in database`,
                    });
                    res.writeHead(400, {
                      "Content-Type": "text/html; charset=utf-8",
                    });
                    res.end(`<h1>Student already in database</h1>`);
                    studentFound = true;
                  }
                });
                if (!studentFound) {
                  students.push(newStudent);
                  fs.writeFile(filename, JSON.stringify(students), (e) => {
                    if (e) {
                      res.writeHead(400, {
                        "Content-Type": "text/html; charset=utf-8",
                      });
                      res.end("<h1>File write error</h1>");
                      throw e;
                    }
                    res.writeHead(400, {
                      "Content-Type": "application/json; charset=utf-8",
                    });
                    res.end(JSON.stringify(newStudent));
                  });
                }
              }
            }
          });
        } else {
          server.emit("Error", {
            shortMsg: "Wrong student id type",
            fullMsg: `Id value of '${newStudent.id}' is not correct`,
          });
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<h1>Wrong student id type</h1>`);
        }
      });
      break;
    case "/backup":
      let currentDate = new Date();
      let copyName = 
      String(currentDate.getFullYear())+
      String((currentDate.getMonth()+1)%10==(currentDate.getMonth()+1)?'0'+(currentDate.getMonth()+1):(currentDate.getMonth()+1))+
      String(currentDate.getDate()%10==currentDate.getDate()?'0'+currentDate.getDate():currentDate.getDate())+
      String(currentDate.getHours()%10==currentDate.getHours()?'0'+currentDate.getHours():currentDate.getHours())+
      String(currentDate.getMinutes()%10==currentDate.getMinutes()?'0'+currentDate.getMinutes():currentDate.getMinutes())+
      String(currentDate.getSeconds()%10==currentDate.getSeconds()?'0'+currentDate.getSeconds():currentDate.getSeconds()) + 
      '_StudentList.json';

      setTimeout(()=>{
        fs.copyFile(filename, copyName,(e)=>{
          if(e) console.log('Error: ',e);
          else{
            try {
              fs.watch(copyName, (event, f) => {
                if (f) server.emit("File changed", { file: f, event: event });
              });
            } catch (e) {
              console.log("catch e = ", e.code);
            }
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
            });
            res.end("<h1>File copy was created</h1>");
          }
        })
      }, 2000);
      
      break;
    default:
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>Bad request</h1>`);
      break;
  }
}

function PUTHandler(req, res) {
  switch (url.parse(req.url).pathname) {
    case "/":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        let updateStudent = JSON.parse(body);
        if (!isNaN(updateStudent.id)) {
          fs.readFile("./StudentList.json", (e, data) => {
            if (e) {
              server.emit("Error", {
                shortMsg: "File read error",
                fullMsg: e.message,
              });
              res.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end(`<h1>File read error: ${e}</h1>`);
            } else {
              if(data!=null){
                let students = JSON.parse(data.toString("utf-8"));
                let fStudent = null;
                students.forEach((s) => {
                  if (s.id == updateStudent.id) {
                    fStudent = s;
                  }
                });
                if(fStudent == null){
                  server.emit("Error", {
                    shortMsg: "Student not found",
                    fullMsg: "Student not found",
                  });
                  res.writeHead(404, {
                    "Content-Type": "text/html; charset=utf-8",
                  });
                  res.end(`<h1>Student not found</h1>`);
                }else{
                  let idx = students.indexOf(fStudent);
                  students[idx] = updateStudent;
                  fs.writeFile(filename, JSON.stringify(students), (e) => {
                    if (e) {
                      res.writeHead(400, {
                        "Content-Type": "text/html; charset=utf-8",
                      });
                      res.end("<h1>File write error</h1>");
                      throw e;
                    }
                    res.writeHead(404, {
                      "Content-Type": "application/json; charset=utf-8",
                    });
                    res.end(JSON.stringify(updateStudent));
                  });
                }
              }
            }
          });
          return;
        }
        server.emit("Error", {
          shortMsg: "Wrong student id type",
          fullMsg: `Id value of '${updateStudent.id}' is not correct`,
        });
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Wrong student id type</h1>`);
      });
      break;
    default:
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>Bad request</h1>`);
      break;
  }
}

function DELETEHandler(req, res) {
  if (RegExp(/^\/[0-9]+/).test(url.parse(req.url).pathname)) {
    let id = req.url.split('/')[1]
    fs.readFile(filename, (e,data)=>{
      if (e) {
        server.emit("Error", {
          shortMsg: "File read error",
          fullMsg: e.message,
        });
        res.writeHead(404, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.end(`<h1>File read error: ${e}</h1>`);
      }else{
        if(data!=null){
          let students = JSON.parse(data);
          let fStudent = null;
          students.forEach((s) => {
            if (s.id == Number(id)) {
              fStudent = s;
            }
          });
          if(fStudent == null){
            server.emit("Error", {
              shortMsg: "Student not found",
              fullMsg: "Student not found",
            });
            res.writeHead(404, {
              "Content-Type": "text/html; charset=utf-8",
            });
            res.end(`<h1>Student not found</h1>`);
          }else{
            let idx = students.indexOf(fStudent);
            students.splice(idx,1);
            fs.writeFile(filename, JSON.stringify(students), (e) => {
              if (e) {
                res.writeHead(400, {
                  "Content-Type": "text/html; charset=utf-8",
                });
                res.end("<h1>File write error</h1>");
                throw e;
              }
              res.writeHead(404, {
                "Content-Type": "application/json; charset=utf-8",
              });
              res.end(JSON.stringify(fStudent));
            });
          }
        }
      }
    })
    return;
  }
  if (
    RegExp(/^\/backup\/\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/).test(
      url.parse(req.url).pathname
    )
  ) {
    let dateString = req.url.split('/')[2];
    let year = dateString.substring(0,4);
    let month = dateString.substring(4,6);
    let day = dateString.substring(6,8);
    fs.readdir('.',{withFileTypes:true},(err, files)=>{
      if(err) console.log('Error ',e);
      else{
        files.forEach((f)=>{
          if(RegExp(/^\d{4}\d{2}\d{2}([0-1][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])_StudentList\.json$/).test(f.name)){
            if(Number(f.name.substring(0,4))<Number(year) || Number(f.name.substring(4,6)) < Number(month) || Number(f.name.substring(6,8)) < Number(day)){
              fs.unlink(f.name,(e)=>{
                if(e) console.log('Error: ',e)
                else console.log('File deleted');
              })
            }
          }
        })
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.end("<h1>Operation completed</h1>");
      }
    })
    return;
  }
}

let server = new rpcWSS({ port: 4000, host: "localhost" });
server.event("Error");
server.event("File changed");
