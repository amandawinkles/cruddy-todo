const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// var id = counter.getNextUniqueId();
// items[id] = text;
// callback(null, { id, text });
//Use the unique id to create a file path inside the dataDir
//data type ok for writeFile?
//counter not updating
exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error', err);
    } else {
      items[id] = text;
      var directory = exports.dataDir;
      //console.log(`${id}.txt`);
      var pathFinder = path.join(directory, `${id}.txt`);
      fs.writeFile(pathFinder, text, 'utf8', (err) => {
        if (err) {
          console.log('error', err);
        } else {
          //console.log("👮‍♂️", id, "�", text);
          //update counter call getNextUniqId
          callback(null, { id, text });
        }
      });
    }
  });
};


/*
var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
*/
exports.readAll = (callback) => {
  //data = todoList
  //return array of todos
  fs.readdir(exports.dataDir, 'utf8', function(err, files) {
    //console.log('〽️', text, '👮🏼‍♀️', id);
    if (err) {
      console.log('error', err);
    } else {
      //console.log('🔻', files);
      var data = _.map(files, function(file) {
        //console.log('🔵', file);
        //console.log('💂🏿‍♂️', file.split('.')[0]);
        text = file.split('.')[0];
        id = file.split('.')[0];
        return { id, text };
      });
      callback(null, data);
    }
  });
};


/*
var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
*/
exports.readOne = (id, callback) => {
  var directory = exports.dataDir;
  var pathFinder = path.join(directory, `${id}.txt`);
  fs.readFile(pathFinder, 'utf8', function(err, data) {
    if (err) {
      console.log('error', err);
      callback(err, null);
    } else {
      console.log('👨🏼‍🎤', data);
      text = data;
      console.log('👞', text);
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
