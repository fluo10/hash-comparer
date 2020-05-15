//const fs = require('fs').remote
const electron = require('electron');
const remote = electron.remote;
const {FileStatus} = remote.require('./path2hash');
const ipcRenderer = electron.ipcRenderer;
/*
const filename = __dirname + "\\index.html";
lib.get_hash_local(filename,function(result){
    document.querySelector('#test').innerHTML = result; 
});
*/

let enableAutoDigest = true;



let CompareStatus = {
    Unfilled: 0, 
    Matched : 1,
    Missmatched : 2,
    Error: 3
}

let compareStatus = CompareStatus.Unfilled;
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

function compareHash(){
    let resultelement = document.getElementById(result);
    let compareResult = "";
    if ((inputboxes[0].value.length == 0) || (inputboxes[1].value.length == 0)){
        compareResult = "ファイルを2つ選択してください";
        compareStatus = CompareStatus.Unfilled;
    }else if (inputboxes[0].value == inputboxes[1].value) {
        compareResult = "選択中のファイルは2つとも同じ場所のものです";
        compareStatus = CompareStatus.Error;
    } else if (resultboxes[0].textContent == resultboxes[1].textContent){
        compareResult = "2つのファイルは同じです";
        compareStatus = CompareStatus.Matched;
    } else{
        compareResult = "2つのファイルは一致しませんでした。";
        compareStatus = CompareStatus.Missmatched;
    }
} 
ipcRenderer.on('return-hash', (event, index, hash) => {
    let resultbox = resultboxes[index];
    console.log( 'Returned hash : ' + hash);
    resultbox.textContent = hash;

    return;
});
function updateFileStatus(index, fileStatus){
    switch (fileStatus) {
        case FileStatus.Blank :
            break;
        case FileStatus.Invalid:
            break;
        case FileStatus.Missing:
            break;
        case FileStatus.Finded:
            break;
        case FileStatus.Digesting:
            break;
        case FileStatus.Completed:
            break;
    }
};
//ipcRenderer.send('get-hash', "./index.html");

ipcRenderer.on('update-file-status', (event, index, fileStatus) => {
    updateFileStatus(index, fileStatus);
})
console.log(FileStatus.Blank)