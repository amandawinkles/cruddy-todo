const fs = require('fs');
const Promise = require('bluebird');
Promise.promisifyAll(fs);
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error', err);
    } else {
      items[id] = text;
      var directory = exports.dataDir;
      var pathFinder = path.join(directory, `${id}.txt`);
      fs.writeFile(pathFinder, text, 'utf8', (err) => { //fs.writeFileAsync.then
        if (err) {
          console.log('error', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir, 'utf8')
    .then((files) => {
      var data = _.map(files, function(file) {
        var id = file.split('.')[0];
        var directory = exports.dataDir;
        var pathFinder = path.join(directory, `${id}.txt`);
        return fs.readFileAsync(pathFinder, 'utf8')
          .then((fileText) => { //text
            return { id: id, text: fileText }; //{id, text}
          })
          .catch((err) => {
            callback(err);
          });
      });
      console.log('👙', data);
      Promise.all(data).then((data) => {
        console.log(data);
        callback(null, data);
      });
    })
    .catch((err) => {
      callback(err);
    });
};

/*
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
        //text = file.split('.')[0];
        id = file.split('.')[0];
        return { id, text };
      });
      callback(null, data);
    }
  });
};
*/

exports.readOne = (id, callback) => {
  var directory = exports.dataDir;
  var pathFinder = path.join(directory, `${id}.txt`);
  fs.readFile(pathFinder, 'utf8', function(err, data) {
    if (err) {
      console.log('error', err);
      callback(err, null);
    } else {
      //console.log('👨🏼‍🎤', data);
      text = data;
      //console.log('👞', text);
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var directory = exports.dataDir;
  var pathFinder = path.join(directory, `${id}.txt`);
  fs.readFile(pathFinder, 'utf8', (err) => {
    if (err) {
      console.log('error', err);
      callback(err);
      //callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathFinder, text, 'utf8', (err, data) => {
        if (err) {
          console.log('error', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var directory = exports.dataDir;
  var pathFinder = path.join(directory, `${id}.txt`);
  fs.unlink(pathFinder, (err) => {
    if (err) {
      callback(err);
    } else {
      console.log('🧶', `${pathFinder} was deleted`);
      callback(null, undefined);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
