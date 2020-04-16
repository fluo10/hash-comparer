const crypto = require("crypto");
const fs = require('fs');
const algorithm = 'sha1';
const shasum = crypto.createHash(algorithm);
 
function get_hash_local(filename) { 
    const s = fs.ReadStream(filename)
    s.on('data', function(data) {
        shasum.update(data)
    })
    s.on('end', function(){
        var hash = shasum.digest('hex')
        console.log(hash + ' ' + filename)
    })
}

const filename = __dirname + "/index.html"


console.log(get_hash_local(filename));
