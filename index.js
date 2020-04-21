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
let fileItems = document.getElementsByClassName('file-item')
for( let i = 0; i < fileItems.length; i++ ) {
    /*fileItems[i].ondragstart = (event) => {
        event.preventDefault()
        remote.ipcRenderer.send('ondragstart', '/path/to/item')
    }?*/
    let fileItem = fileItems[i];
    fileItem.ondragover = function() {
        fileItem.classList.add("ondragover");
        return false;
    };
    
    fileItem.ondragleave = function() {
        fileItem.classList.remove("ondragover");
        return false;
    };
    
    fileItem.ondragend = function() {
        fileItem.classList.remove("ondragover");
        return false;
    };
    
    fileItem.ondrop = function(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        fileItems[i].innerText = file.path;
        return false;
    };
    
}
