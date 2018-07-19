"use strict";
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const table = "asterisk_cel_nami";
const AmiClient = require('asterisk-ami-client');
let mysql = require('mysql');
let client = new AmiClient();
let request = require('request');
let config = {
    host: "localhost",
    user: "mysql",
    password: "mysql"
};

let database = new Database(config);
var con = mysql.createConnection(config);

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Mysql connected");
    var sql = "USE asterisk_crm_db;";
    con.query(sql, function (err, result) {
        if (err)
            throw err;
        console.log("Switched to asterisk_cel_nami table");
        client.connect('sugarami', 'e6v2yozIsJ8H', {host: 'internal.ats.sugare.ru', port: 5038})
                .then(amiConnection => {
                    client
                            .on('connect', () => console.log('AMI connected'))
                            // .on('event', event => console.log(event))
                            .on('event', event => {
                                if (event.Event == "CEL") {
                                    var sql = "INSERT INTO asterisk_cel_nami (calleridnum, calleridani, calleriddnid, eventname, eventtime, exten, linked_id, unique_id) " +
                                            " VALUES ('" + event.CallerIDnum + "', '" + event.CallerIDani + "', '" + event.CallerIDdnid + "', '" + event.EventName + "', '" + event.EventTime + "', '" + event.Exten + "', '" + event.LinkedID + "', '" + event.UniqueID + "')";
                                    con.query(sql, function (err, result) {
                                        if (err) throw err;
                                    });
                                    if (event.EventName == 'LINKEDID_END') {

                                        var data = {
                                            'user_id': '',
                                            'number': '',
                                            'operator': '',
                                            'direction': '',
                                            'linked_id': event.LinkedID,
                                            'unique_id': event.LinkedID,
                                            'audio_file_name': event.LinkedID
                                        };

                                        database.query('USE asterisk_crm_db ')
                                                .then(rows => {
                                                    console.log('linkedID:'+event.LinkedID);
                                                    return database.query('SELECT calleridnum as cid1, u.id as uid FROM ' + table + ' ac left join users u on ac.calleridnum = u.asterisk_extension WHERE char_length(calleridnum) < 4 AND linked_id = "' + event.LinkedID + '" ORDER BY ac.id DESC LIMIT 1');
                                                })
                                                .then(rows => {
                                                    data.operator = rows[0].cid1;
                                                    data.user_id = rows[0].uid;
                                                    return database.query('SELECT calleridnum as cid2 FROM ' + table + ' ac WHERE char_length(calleridnum) > 8 AND linked_id = "' + event.LinkedID + '" ORDER BY ac.id ASC LIMIT 1');
                                                })
                                                .then(rows => {
                                                    data.number = rows[0].cid2;
                                                    return database.query('SELECT char_length(calleridnum) as cid3 FROM ' + table + ' ac WHERE linked_id = "' + event.LinkedID + '" ORDER BY ac.id ASC LIMIT 1');
                                                    //return database.close()
                                                })
                                                .then(rows => {
                                                    if (rows[0].cid3 == 3) {
                                                        data.direction = "Outbound";
                                                    } else {
                                                        data.direction = "Inbound";
                                                    }
                                                    ;

                                                    return database.query('select calleridnum, unique_id from asterisk_cel_nami where true '
                                                            + ' and linked_id = "' + data.audio_file_name + '"'
                                                            + ' and calleridnum != "' + data.number + '"'
                                                            + ' and (eventname = "BRIDGE_EXIT" or eventname = "LINKEDID_END")'
                                                            + ' group by calleridnum'
                                                            );
                                                })
                                                .then(rows => {
                                                    let numbers = [];
                                                    // console.log('rows');
                                                    // console.log(rows);
                                                    // console.log('data:');
                                                    // console.log(data);
                                                    if (rows.length !== 0) {
                                                    // if (rows != null) {//проверка на пропущенный? если да,то не работает. нужна проверка на length == 0
                                                        if (data.user_id != null) {
                                                            if (data.user_id == 1 || data.user_id.length == 36)
                                                                if (data.number.length > 8)
                                                                    if (data.operator.length == 3)
                                                                        if (data.direction.length > 1) {
                                                                            // try save
                                                                            // console.log('rows');
                                                                            // console.log(rows);
                                                                            for (let i = 0, len = rows.length; i < len; i++) {
                                                                                if (rows[i].calleridnum==data.operator) {//без этого условия входящий сохраняется дважды
                                                                                    data.operator = rows[i].calleridnum;
                                                                                    data.unique_id = rows[i].unique_id;
                                                                                    console.log("Trying to save " + data.direction + " " + data.linked_id);
                                                                                    save(data);
                                                                                }
                                                                            }
                                                                        }
                                                            return true;
                                                        } else {
                                                            console.log("no user for " + data.operator + " = skip saving");
                                                        }
                                                    } else {
                                                        if (data.user_id==null){
                                                            data.user_id='';
                                                        }
                                                        //try save missing call
                                                        console.log("Trying to save missing " + data.linked_id);
                                                        save(data);
                                                        return false;
                                                    }
                                                })
                                    }
                                }
                            })/**/
                            // .on('data', chunk => console.log(chunk))
                            .on('response', response => console.log(response))
                            .on('disconnect', () => {console.log('disconnect')
                                                        process.exit()})
                            .on('reconnection', () => console.log('reconnection'))
                            .on('internalError', error => console.log(error))
                            .action({
                                Action: 'Ping'
                            });

                    // setTimeout(() => {
                    //     client.disconnect();
                    // }, 5000);

                })
                .catch(error => console.log(error));
    });
});

function is_user(ext) {
    var q = "SELECT id FROM users WHERE asterisk_extension = '" + ext + "' AND deleted = 0 LIMIT 1";
    // console.log(q);
    con.query(q, function (err, result) {
        if (err) {
            // throw err;
            return false;
        }
        ;
        console.log(result[0].id);
    });
    return 123;
}

function getcallerid(linked_id) {
    var q = "SELECT calleridnum FROM " + table + " WHERE CHAR_LENGTH(calleridnum) > 8 AND event = 'CHAN_START' ORDER BY id LIMIT 1";
    con.query(q, function (err, result) {
        if (err)
            // throw err;
            return false;
        console.log(result[0].calleridnum);
    });
}



function save(data)
{
    console.log("Sent to save lid=" + data.linked_id + ' uid=' + data.unique_id + ' operator=' + data.operator);

    var options = {
        method: 'POST',
        url: 'http://asterisk.crm/index.php',
        qs: {
            entryPoint: 'save_calls', to_pdf: 'true'
        },
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        },
        formData: {
            user_id: data.user_id,
            number: data.number,
            operator: data.operator,
            direction: data.direction,
            unique_id: data.unique_id,
            linked_id: data.linked_id,
            audio_file_name: data.audio_file_name,
            source: "",
        }
    };

    console.log("before request");

    request(options, function (error, response, body) {
        
        if (error)
            throw new Error(error);
        console.log(body);
    });
}
