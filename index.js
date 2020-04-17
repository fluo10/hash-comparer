//const fs = require('fs').remote
const electron = require('electron');
const remote = electron.remote;
const lib = remote.require('./lib');


const filename = __dirname + "\\index.html";
lib.get_hash_local(filename,function(result){
    document.querySelector('#test').innerHTML = result; 
});
document.getElementById('drag').ondragstart = (event) => {
    event.preventDefault()
    ipcRenderer.send('ondragstart', '/path/to/item')
}