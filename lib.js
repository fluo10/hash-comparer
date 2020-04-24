const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const algorithm = 'sha1';
const request = require("request");
var shasum;
var PathType = {
    local : 0,
    remote : 1
}

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
function getPathType(path){
    if (path.slice( 0, 4) == 'http') {
        return PathType.remote
    } else {
        return PathType.local
    }
}
function getHash(path, result){
    switch (getPathType(path)){
        case PathType.remote:
            getHashRemote(path, result);
    }

}

function getHashRemote(path, result){
    console.log('Get file from : ' + path);
    shasum = crypto.createHash(algorithm);
    /*
    request(
        {method: 'GET', url: path, encoding: null},
        (error, response, body) => {
            //if(!error && response.statusCode === 200){
                shasum.update(body);
                hash = shasum.digest('hex');
                result(hash);
            //}else{
            //    result(error);
            //}
        }
    );
    */
    var stream = request(path);
    stream.on('data', (data) =>{
        shasum.update(data);
    });
    stream.on('end', () => {
        var hash = shasum.digest('hex');
        result(hash);
    });
}

function existPath(path, error){
    switch (getPathType(path)){
        case PathType.remote:
            true;
            break;
        case PathType.local:
            fs.access(path, fs.constants.R_OK, (e) => {
                error(e);
            });
            break;

    }
}


//get_hash_local(path.join(__dirname , "index.html"), function(callback){
//    console.log(callback)
//});

getHashRemote(
    "https://www.google.com/logos/doodles/2020/stay-home-save-lives-april-23-copy-6753651837108787-law.gif",
    (result) => {console.log(result);}
)

module.exports.get_hash_local = get_hash_local;