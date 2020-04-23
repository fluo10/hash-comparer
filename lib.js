const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const algorithm = 'sha1';
var shasum;

const electron = require('electron');
const remote = electron.remote;
function get_hash_local(filename, callback) { 
    shasum = crypto.createHash(algorithm);
    var s = fs.createReadStream(filename);
    var hash;
    s.on('data', function(data) {
        shasum.update(data);
    })
    s.on('end', function(){
        hash = shasum.digest('hex');
        if(callback){
            callback(hash + ' ' + filename);
        }
    })
    //return (hash + ' ' + filename);
}

function getHash(path){

}

function existPath(path){

}


get_hash_local(path.join(__dirname , "index.html"), function(callback){
    console.log(callback)
});

module.exports.get_hash_local = get_hash_local;