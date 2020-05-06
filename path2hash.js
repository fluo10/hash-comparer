const crypto = require("crypto");
const fs = require('fs');
//const path = require('path');
const algorithm = 'sha1';
const request = require("request");
//const url = require('url');

var PathType = {
    local : 0,
    remote : 1,
    invalid : 2
}

const electron = require('electron');
const remote = electron.remote;
function getHashLocal(filename, callback) { 
    let shasum = crypto.createHash(algorithm);
    let s = fs.createReadStream(filename);
    let hash;
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
        console.log('PathType: remote')
        return PathType.remote;
    } else {
        console.log('PathType: local')
        return PathType.local
    }
}
function getHash(path, callback){
    switch (getPathType(path)){
        case PathType.remote:
            getHashRemote(path, callback);
            break;
        case PathType.local:
            getHashLocal(path, callback);
            break;
    }
}

function getHashRemote(url, result){
    console.log('Get file from url: ' + url);
    let shasum = crypto.createHash(algorithm);
    /*
    request(
        {method: 'GET', url: url, encoding: null},
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
    let stream = request(url);
    stream.on('data', (data) =>{
        console.log(data)
        shasum.update(data);
    });
    stream.on('end', () => {
        let hash = shasum.digest('hex');
        console.log('End stream');
        result(hash);
    });
}

function validatePath(path, callback){
    switch (getPathType(path)){
        case PathType.remote:
            request({url: path,
            method: 'HEAD'})
            callback(true)
            break;
        case PathType.local:
            fs.access(path, fs.constants.R_OK, (e) => {
                callback(e);
            });
            break;
        case PathType.invalid:
            callback(Error("Invalid Path"));
    }
}


//getHashLocal(path.join(__dirname , "index.html"), function(callback){
//    console.log(callback)
//});

//let TestUrl = "https://www.google.com/logos/doodles/2020/stay-home-save-lives-april-23-copy-6753651837108787-law.gif"
//getHashRemote(
//    TestUrl,
//    (result) => {console.log( TestUrl + ' ' + result);}
//)

module.exports.getHash = getHash;
module.exports.validatePath = validatePath;