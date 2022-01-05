const sql = require("mssql");

const config = {
  user: "LabLogin",
  password: "abcd0503",
  server: "localhost",
  database: "Lab",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

class DataBase {
  constructor() {
    sql.conn;
    this.connectionPool = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log("Connected to MSSQL");
        return pool;
      })
      .catch((err) => console.log("Connection Failed: ", err));
  }
  processing_result = (err, result) => {
    if (err)
      console.log(
        "processing_result error:",
        err.code,
        err.originalError.info.message
      );
    else {
      let str = "";
      console.log("Количество строк: ", result.rowsAffected[0]);
      for (let i = 0; i < result.rowsAffected[0]; i++) {
        str = "--";
        for (let key in result.recordset[i]) {
          str += `${key} = ${result.recordset[i][key]}`;
        }
        console.log(str);
      }
    }
  };
  get_Faculties() {
    return this.connectionPool.then((pool) =>
      pool.request().query("select * from faculty")
    );
  }
  get_Pulpits() {
    return this.connectionPool.then((pool) =>
      pool.request().query("select * from pulpit")
    );
  }
  get_Subjects() {
    return this.connectionPool.then((pool) =>
      pool.request().query("select * from subject")
    );
  }
  get_Auditoriums_Types() {
    return this.connectionPool.then((pool) =>
      pool.request().query("select * from auditorium_type")
    );
  }
  get_Auditorims() {
    return this.connectionPool.then((pool) =>
      pool.request().query("select * from auditorium")
    );
  }

  get_Pulpit(pulpit) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("pulp", sql.NVarChar, pulpit)
        .query("select * from pulpit where pulpit = @pulp");
    });
  }

  get_Faculty(faculty) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("fac", sql.NVarChar, faculty)
        .query("select * from faculty where faculty = @fac");
    });
  }

  get_Subject(subject) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("sub", sql.NVarChar, subject)
        .query("select * from subject where subject = @sub");
    });
  }
  get_Auditorim(audit) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("audit", sql.NVarChar, audit)
        .query("select * from auditorium where auditorium = @audit");
    });
  }

  post_Faculties(faculty, faculty_name) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("faculty", sql.NVarChar, faculty)
        .input("faculty_name", sql.NVarChar, faculty_name)
        .query(
          "insert faculty(faculty, faculty_name) values(@faculty , @faculty_name)"
        );
    });
  }

  post_Pulpits(pulpit, pulpit_name, faculty) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("pulpit", sql.NVarChar, pulpit)
        .input("pulpit_name", sql.NVarChar, pulpit_name)
        .input("faculty", sql.NVarChar, faculty)
        .query(
          "insert pulpit(pulpit, pulpit_name, faculty) values(@pulpit , @pulpit_name, @faculty)"
        );
    });
  }

  post_Subjects(subject, subject_name, pulpit) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("subject", sql.NVarChar, subject)
        .input("subject_name", sql.NVarChar, subject_name)
        .input("pulpit", sql.NVarChar, pulpit)
        .query(
          "insert subject(subject, subject_name, pulpit) values(@subject , @subject_name, @pulpit)"
        );
    });
  }

  post_Auditoriums_Types(auditorium_type, auditorium_typename) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium_type", sql.NVarChar, auditorium_type)
        .input("auditorium_typename", sql.NVarChar, auditorium_typename)
        .query(
          "insert auditorium_type(auditorium_type, auditorium_typename) values(@auditorium_type , @auditorium_typename)"
        );
    });
  }

  post_Auditoriums(
    auditorium,
    auditorium_name,
    auditorium_capacity,
    auditorium_type
  ) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium", sql.NVarChar, auditorium)
        .input("auditorium_name", sql.NVarChar, auditorium_name)
        .input("auditorium_capacity", sql.Int, auditorium_capacity)
        .input("auditorium_type", sql.NVarChar, auditorium_type)
        .query(
          "insert auditorium(auditorium, auditorium_name, auditorium_capacity, auditorium_type)" +
            " values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)"
        );
    });
  }

  put_Faculties(faculty, faculty_name) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("faculty", sql.NVarChar, faculty)
        .input("faculty_name", sql.NVarChar, faculty_name)
        .query(
          "update faculty set faculty_name = @faculty_name where faculty = @faculty"
        );
    });
  }

  put_Pulpits(pulpit, pulpit_name, faculty) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("pulpit", sql.NVarChar, pulpit)
        .input("pulpit_name", sql.NVarChar, pulpit_name)
        .input("faculty", sql.NVarChar, faculty)
        .query(
          "update pulpit set pulpit_name = @pulpit_name, faculty = @faculty where pulpit = @pulpit"
        );
    });
  }

  put_Subjects(subject, subject_name, pulpit) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("subject", sql.NVarChar, subject)
        .input("subject_name", sql.NVarChar, subject_name)
        .input("pulpit", sql.NVarChar, pulpit)
        .query(
          "update subject set subject_name = @subject_name, pulpit = @pulpit where subject = @subject"
        );
    });
  }

  put_Auditoriums_Types(auditorium_type, auditorium_typename) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium_type", sql.NVarChar, auditorium_type)
        .input("auditorium_typename", sql.NVarChar, auditorium_typename)
        .query(
          "update auditorium_type set auditorium_typename = @auditorium_typename where auditorium_type = @auditorium_type"
        );
    });
  }

  put_Auditoriums(
    auditorium,
    auditorium_name,
    auditorium_capacity,
    auditorium_type
  ) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium", sql.NVarChar, auditorium)
        .input("auditorium_name", sql.NVarChar, auditorium_name)
        .input("auditorium_capacity", sql.Int, auditorium_capacity)
        .input("auditorium_type", sql.NVarChar, auditorium_type)
        .query(
          "update auditorium set auditorium_name = @auditorium_name, auditorium_capacity = @auditorium_capacity, auditorium_type =  @auditorium_type" +
            " where auditorium = @auditorium"
        );
    });
  }

  delete_Faculties(faculty) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("faculty", sql.NVarChar, faculty)
        .query("delete from faculty where faculty = @faculty");
    });
  }

  delete_Pulpits(pulpit) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("pulpit", sql.NVarChar, pulpit)
        .query("delete from pulpit where pulpit = @pulpit");
    });
  }

  delete_Subjects(subject) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("subject", sql.NVarChar, subject)
        .query("delete from subject where subject = @subject");
    });
  }

  delete_Auditoriums_Types(auditorium_type) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium_type", sql.NVarChar, auditorium_type)
        .query(
          "delete from auditorium_type where auditorium_type = @auditorium_type"
        );
    });
  }

  delete_Auditoriums(auditorium) {
    return this.connectionPool.then((pool) => {
      return pool
        .request()
        .input("auditorium", sql.NVarChar, auditorium)
        .query("delete from auditorium where auditorium = @auditorium");
    });
  }
}
module.exports = DataBase;
