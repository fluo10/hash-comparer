//const fs = require('fs').remote
const electron = require('electron');
const remote = electron.remote;
//const lib = remote.require('./lib');
const ipcRenderer = electron.ipcRenderer;
/*
const filename = __dirname + "\\index.html";
lib.get_hash_local(filename,function(result){
    document.querySelector('#test').innerHTML = result; 
});
*/
let enableAutoDigest = true;
//デフォルトのドラッグアンドドロップの停止（内部的にはクロームなのでファイルを開く）
document.ondragover = document.ondrop = function(e) {
    e.preventDefault();
    return false;
};

function dropPath(dataTransfer, inputbox){
    if (dataTransfer.files.length == 0 ){
        dataTransfer.items[0].getAsString((str) => {
            inputbox.setAttribute('value',str);
        });
    } else {
        var file = dataTransfer.files[0];
       inputbox.setAttribute("value", file.path);
        //        fileItem.innerText = file.path;
    }

}

let fileItems = document.querySelectorAll('.file-item');
let inputboxes;
let resultboxes; 
for( let i = 0; i < fileItems.length; i++ ) {
    /*fileItems[i].ondragstart = (event) => {
        event.preventDefault()
        remote.ipcRenderer.send('ondragstart', '/path/to/item')
    }?*/
    let fileItem = fileItems[i];
    inputboxes[i] = fileItem.getElementsByTagName('input')[0];
    resultboxes[i] = fileItem.getElementsByClassName("result")[0];
//    let fileItem = document.getElementById('file1');
    fileItem.addEventListener("dragover", (event) => {
        fileItem.classList.add("ondragover");
        return;
    }, false);
    
    fileItem.addEventListener("dragleave", (event) => {
        fileItem.classList.remove("ondragover");
    }, false);
    
    fileItem.addEventListener("dragend", (event) => {
        fileItem.classList.remove("ondragover");
    }, false);
    
    fileItem.addEventListener("drop", (event) => {
        fileItem.classList.remove("ondragover");
        event.preventDefault();
        console.log(event.dataTransfer)
        dropPath(event.dataTransfer, inputboxes[i])
        if (enableAutoDigest) {
            updateDigest(i);
        }
    }, false);
    
};

function updateDigest(index){
    let inputbox = inputboxes[index];
    ipcRenderer.send('require-hash', index, inputbox.value);
}

ipcRenderer.on('return-hash', (event, hash, index) => {
    let resultbox = resultbox[index];
    console.log( 'Returned hash : ' + hash);
    resultbox.innerText = hash;
    return;
});

ipcRenderer.send('get-hash', "./index.html");

