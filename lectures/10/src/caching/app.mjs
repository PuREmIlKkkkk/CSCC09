import { createServer } from "http";
import express from "express";
import Datastore from "nedb";

const app = express();
const PORT = 3000;

app.use(express.text({type:"*/*"}));

const db = new Datastore({ filename: 'db/messages.db', autoload: true, timestampData : true});

const getMessages = function(callback){
    // get messages from database
    console.log("Retrieving messages from the database");
    db.find({}, function (err, data) {
        if (err) return callback(err, null);
        let messages = data.map(function(message){return message.content;}).join("/n");
        callback(null, messages);
    });
}

const storeMessage = function(message, callback){
    // store message in the database
    console.log("Storing message in the database");
    db.insert({content: message}, function (err, data){
        if (err) return callback(err);
        return callback(null);;
    });
};

app.use(function (req, res, next){
    req.start = Date.now();
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

// curl -X POST -d "hello" http://localhost:3000/messages/
app.post('/messages/', function (req, res, next) {
    storeMessage(req.body,function(err){
        if (err) res.status(500).end(err);
        else res.end("message stored");
        next();
    });
});

// curl http://localhost:3000/messages/
app.get('/messages/', function (req, res, next) {
    getMessages(function(err, data){
        if (err) res.status(500).end(err);
        else res.end(data);
        next();
    });
});

app.use(function (req, res, next){
    let time = Date.now() - req.start;
    console.log("HTTP Response", res.statusCode, time, "ms");
});

createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
