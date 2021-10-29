var util = require('util');
var ee = require('events');
const { EventEmitter } = require('stream');

var db_data = [
    {id:1, name: 'Иванов И.И.', bday: '2000-01-01'},
    {id:2, name: 'Петров П.П.', bday: '2000-01-02'},
    {id:3, name: 'Сидоров С.С.', bday: '2000-01-03'}
];

class DB extends EventEmitter{
    get_by_id(id){
        let row = -1;
        db_data.forEach(element=>{
            if(element.id == id){
                row = element;
            }
        });
        return row;
    }

    select(){
        return db_data;
    }

    insert(row){
        let id = 0;
        db_data.forEach(elem=>{
            if(elem.id>id){
                id = elem.id;
            }
        })
        row.id = id+1;
        db_data.push(row);
    }

    update(row){
        let index = db_data.findIndex(el=>el.id == row.id);
        if(index !== -1){
            db_data[index] = row;
        }
    }

    delete(id){
        let index = db_data.findIndex(el=> el.id == id);
        if(index !== -1){
            var row = db_data[index];
            db_data.splice(index, 1);
            return row;
        }
        return index;
    }

    commit(){
        
    }
}

exports.DB = DB;