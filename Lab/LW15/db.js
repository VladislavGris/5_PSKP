const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

class DB {
  constructor() {
    this.url =
      "mongodb+srv://vladislav:abcd0503@bstu.sw5zn.mongodb.net/BSTU?retryWrites=true&w=majority";
    this.client = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client = this.client.connect().then((connection) => {
      return connection.db("BSTU");
    });
    console.log("Connected to MongoDB");
  }

  GetRecordsByTableName(tableName) {
    return this.client.then((db) => {
      return db.collection(tableName).find({}).toArray();
    });
  }

  InsertRecords(tableName, tableColumn, code, fields) {
    return this.client.then(async (db) => {
      let tableCol = JSON.parse('{"' + tableColumn + '": "' + code + '"}');
      console.log(tableCol);
      console.log(fields);
      await db
        .collection(tableName)
        .findOne(tableCol)
        .then((record) => {
          if (record) throw "This doc exists";
          return record;
        });
      db.collection(tableName).insertOne(fields, (err, r) => {
        if (err) console.log(err);
        else {
          console.log(r.insertedCount);
        }
      });
      return this.GetRecord(tableName, tableCol);
    });
  }

  UpdateRecords(tableName, id, fields) {
    return this.client.then(async (db) => {
      if (!id) {
        throw "Wrong ID";
      }
      delete fields._id;
      await this.GetRecord(tableName, { _id: ObjectId(id) });
      await db
        .collection(tableName)
        .updateOne({ _id: ObjectId(id) }, { $set: fields });
      return this.GetRecord(tableName, fields);
    });
  }

  GetRecord(tableName, fields) {
    return this.client
      .then((db) => {
        return db.collection(tableName).findOne(fields);
      })
      .then((record) => {
        if (!record) throw "No records";
        return record;
      });
  }

  IsFacultyExist(code) {
    let tableCol = JSON.parse('{"faculty": "' + code + '"}');
    return this.client
      .then((db) => {
        return db.collection("faculty").findOne(tableCol);
      })
      .then((record) => {
        if (!record) return false;
        return true;
      });
  }

  DeleteRecord(tableName, tableColumn, code) {
    return this.client.then(async (db) => {
      if (!code) {
        throw "Wrong faculty";
      }
      let tableCol = JSON.parse('{"' + tableColumn + '": "' + code + '"}');
      let removedRecord = await this.GetRecord(tableName, tableCol);
      await db.collection(tableName).deleteOne(tableCol);
      return removedRecord;
    });
  }
}

module.exports = DB;
