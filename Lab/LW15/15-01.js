const DB = require("./db");
const http = require("http");
const url = require("url");
const Db = new DB();

let GET_handler = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  switch (url.parse(req.url).pathname) {
    case "/api/faculties":
      Db.GetRecordsByTableName("faculty")
        .then((records) => {
          console.log(records);
          res.end(JSON.stringify(records));
        })
        .catch((error) => {
          write_error_400(res, error);
        });
      break;
    case "/api/pulpits":
      Db.GetRecordsByTableName("pulpit")
        .then((records) => {
          console.log(records);
          res.end(JSON.stringify(records));
        })
        .catch((error) => {
          write_error_400(res, error);
        });
      break;
    default:
      write_error_400(res, "Invalid URL");
      break;
  }
};

let POST_handler = (req, res) => {
  let data_json = "";
  switch (url.parse(req.url).pathname) {
    case "/api/faculties":
      req.on("data", (chunk) => {
        data_json += chunk;
      });
      req.on("end", () => {
        data_json = JSON.parse(data_json);
        res.writeHead(200, { "Content-Type": "application/json" });
        Db.InsertRecords("faculty", "faculty", data_json.faculty, data_json)
          .then((records) => res.end(JSON.stringify(records)))
          .catch((error) => {
            write_error_400(res, error);
          });
      });
      break;
    case "/api/pulpits":
      req.on("data", (chunk) => {
        data_json += chunk;
      });
      req.on("end", () => {
        data_json = JSON.parse(data_json);
        res.writeHead(200, { "Content-Type": "application/json" });
        Db.IsFacultyExist(data_json.faculty).then((result) => {
          if (result) {
            Db.InsertRecords("pulpit", "pulpit", data_json.pulpit, data_json)
              .then((records) => res.end(JSON.stringify(records)))
              .catch((error) => {
                write_error_400(res, error);
              });
          } else {
            write_error_400(res, "No such faculty");
          }
        });
      });
      break;
    default:
      write_error_400(res, "Invalid URL");
      break;
  }
};

let PUT_handler = (req, res) => {
  let data_json = "";
  switch (url.parse(req.url).pathname) {
    case "/api/faculties":
      req.on("data", (chunk) => {
        data_json += chunk;
      });
      req.on("end", () => {
        data_json = JSON.parse(data_json);
        res.writeHead(200, { "Content-Type": "application/json" });
        Db.UpdateRecords("faculty", data_json._id, data_json)
          .then((records) => res.end(JSON.stringify(records)))
          .catch((error) => {
            write_error_400(res, error);
          });
      });
      break;
    case "/api/pulpits":
      req.on("data", (chunk) => {
        data_json += chunk;
      });
      req.on("end", () => {
        data_json = JSON.parse(data_json);
        res.writeHead(200, { "Content-Type": "application/json" });
        Db.IsFacultyExist(data_json.faculty).then((result) => {
          if (result) {
            Db.UpdateRecords("pulpit", data_json._id, data_json)
              .then((records) => res.end(JSON.stringify(records)))
              .catch((error) => {
                write_error_400(res, error);
              });
          } else {
            write_error_400(res, "No such faculty");
          }
        });
      });
      break;
    default:
      write_error_400(res, "Invalid URL");
      break;
  }
};

let DELETE_handler = (req, res) => {
  let path = decodeURI(url.parse(req.url).pathname);
  let path_mas = path.split("/");
  switch ("/api/" + path_mas[2]) {
    case "/api/faculties":
      res.writeHead(200, { "Content-Type": "application/json" });
      console.log(path_mas[3]);
      Db.DeleteRecord("faculty", "faculty", path_mas[3])
        .then((records) => {
          res.end(JSON.stringify(records));
        })
        .catch((error) => {
          write_error_400(res, error);
        });
      break;
    case "/api/pulpits":
      res.writeHead(200, { "Content-Type": "application/json" });
      console.log(path_mas[3]);
      Db.DeleteRecord("pulpit", "pulpit", path_mas[3])
        .then((records) => {
          res.end(JSON.stringify(records));
        })
        .catch((error) => {
          write_error_400(res, error);
        });
      break;
    default:
      write_error_400(res, "Invalid URL");
      break;
  }
};

let http_handler = (req, res) => {
  switch (req.method) {
    case "GET":
      GET_handler(req, res);
      break;
    case "POST":
      POST_handler(req, res);
      break;
    case "PUT":
      PUT_handler(req, res);
      break;
    case "DELETE":
      DELETE_handler(req, res);
      break;
    default:
      write_error_400(res, "Invalid Method");
      break;
  }
};
function write_error_400(res, error) {
  res.statusCode = 400;
  res.statusMessage = "Invalid method";
  let htmlText = "<h1>Error 400</h1> </br> <h3>" + error + "</h3>";
  res.end(htmlText);
}

let server = http.createServer();
server
  .listen(3000, () => {
    console.log("Server is running at localhost:3000");
  })
  .on("request", http_handler);
