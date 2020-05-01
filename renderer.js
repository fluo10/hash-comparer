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

function dropPath(dataTransfer, index){
    console.log('Start dropPath (' + index + ')')
    if (dataTransfer.files.length == 0 ){
        console.log("Drop url")
        dataTransfer.items[0].getAsString((str) => {
            inputboxes[index].setAttribute('value',str);
            if (enableAutoDigest) {
                updateDigest(index);
            }
        });
    } else {
        console.log('Drop local file');
        var file = dataTransfer.files[0];
       inputboxes[index].setAttribute("value", file.path);
        //        fileItem.innerText = file.path;
        if (enableAutoDigest) {
            updateDigest(index);
        }
    }

}

let fileItems = document.querySelectorAll('.file-item');
let inputboxes = [];
let resultboxes = []; 
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
        dropPath(event.dataTransfer, i);
    }, false);
    
};

function updateDigest(index){
    console.log('Call updateDigest ' + index)
    let inputbox = inputboxes[index];
    ipcRenderer.send('require-hash', index, inputbox.value);
}

ipcRenderer.on('return-hash', (event, index, hash) => {
    let resultbox = resultboxes[index];
    console.log( 'Returned hash : ' + hash);
    resultbox.textContent = hash;
    return;
});

//ipcRenderer.send('get-hash', "./index.html");

