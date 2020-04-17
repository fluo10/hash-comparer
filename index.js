//const fs = require('fs').remote
const electron = require('electron');
const remote = electron.remote;
const lib = remote.require('./lib');


const filename = __dirname + "\\index.html";
lib.get_hash_local(filename,function(result){
    document.querySelector('#test').innerHTML = result; 
});

//デフォルトのドラッグアンドドロップの停止（内部的にはクロームなのでファイルを開く）
document.ondragover = document.ondrop = function(e) {
    e.preventDefault();
    return false;
}
const fileItems = document.getElementsByClassName('file-item')
fot(let i = 0; i < fileItem.length; i++) {
    /*fileItems[i].ondragstart = (event) => {
        event.preventDefault()
        remote.ipcRenderer.send('ondragstart', '/path/to/item')
    }?*/
    fileItems[i].ondragover = function() {
        return false;
    };
    
    fileItems[i].ondragleave = function() {
        return false;
    };
    
    fileItems[i].ondragend = function() {
        return false;
    };
    
    fileItems[i].ondrop = function(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        fileItems[i].innerText = file.path;
        return false;
    };
    
}