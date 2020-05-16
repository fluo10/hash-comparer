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

function FileItem(dropArea, inputBox, status, resultBox){    
    this.dropArea = dropArea;
    this.inputBox = inputBox;
    this.status = status;
    this.resultBox = resultBox;
}
let fileItems = [];

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
            fileItems[index].inputBox.setAttribute('value',str);
            if (enableAutoDigest) {
                updateDigest(index);
            }
        });
    } else {
        console.log('Drop local file');
        var file = dataTransfer.files[0];
       fileItems[index].inputBox.setAttribute("value", file.path);
        //        fileItem.innerText = file.path;
        if (enableAutoDigest) {
            updateDigest(index);
        }
    }

}

window.onload = () => {
    let dropAreas = document.querySelectorAll('.drop-area');
    for( let i = 0; i < dropAreas.length; i++ ) {
        /*fileItems[i].ondragstart = (event) => {
            event.preventDefault()
            remote.ipcRenderer.send('ondragstart', '/path/to/item')
        }?*/
        let dropArea = dropAreas[i];
        fileItems[i] = new FileItem(dropArea, 
            dropArea.getElementsByTagName('input')[0],
            dropArea.getElementsByClassName('file-status')[0],
            dropArea.getElementsByClassName("result")[0])
        //    let dropArea = document.getElementById('file1');
        dropArea.addEventListener("dragover", (event) => {
            dropArea.classList.add("ondragover");
            return;
        }, false);
        
        dropArea.addEventListener("dragleave", (event) => {
            dropArea.classList.remove("ondragover");
        }, false);
        
        dropArea.addEventListener("dragend", (event) => {
            dropArea.classList.remove("ondragover");
        }, false);
        
        dropArea.addEventListener("drop", (event) => {
            dropArea.classList.remove("ondragover");
            event.preventDefault();
            console.log(event.dataTransfer)
            dropPath(event.dataTransfer, i);
        }, false);
    
    };
};

function updateDigest(index){
    console.log('Call updateDigest ' + index);
    updateFileStatus(index, FileStatus.Digesting)
    let inputbox = fileItems[index].inputBox;
    ipcRenderer.send('require-hash', index, inputbox.value);
};

function compareHash(){
    let resultelement = document.getElementById(result);
    let compareResult = "";
    if ((fileItems[0].inputBox.value.length == 0) || (fileItems[1].inputBox.value.length == 0)){
        compareResult = "ファイルを2つ選択してください";
        compareStatus = CompareStatus.Unfilled;
    }else if (fileItems[0].inputBox.value == fileItems[1].inputBox.value) {
        compareResult = "選択中のファイルは2つとも同じ場所のものです";
        compareStatus = CompareStatus.Error;
    } else if (fileItems[0].resultBox.textContent == fileItems[1].resultBox.textContent){
        compareResult = "2つのファイルは同じです";
        compareStatus = CompareStatus.Matched;
    } else{
        compareResult = "2つのファイルは一致しませんでした。";
        compareStatus = CompareStatus.Missmatched;
    }
} 
ipcRenderer.on('return-hash', (event, index, hash) => {
    let resultbox = fileItems[index].resultBox;
    console.log( 'Returned hash : ' + hash);
    resultbox.textContent = hash;
    updateFileStatus(index, FileStatus.Completed)
    return;
});
function updateFileStatus(index, fileStatus){
    let status = fileItems[index].status;
    switch (fileStatus) {
        case FileStatus.Blank:
            status.textContent = "パスもしくはURLを入力してください";
            status.classList.remove("error");
            status.classList.remove("completed");
            break;
        case FileStatus.Invalid:
            status.textContent = "入力された文字列は形式が間違っています";
            status.classList.add("error");
            status.classList.remove("completed");
            break;
        case FileStatus.Missing:
            status.textContent = "ファイルが取得できませんでした。";
            status.classList.add("error");
            status.classList.remove("completed");
            break;
//      ダイジェストが想定よりもサクッと出たので、ファイル入力時にダイジェストまで行うため、このステータスは未使用
//        case FileStatus.Finded:
//            break;
        case FileStatus.Digesting:
            status.textContent = "ダイジェスト中です";
            status.classList.remove("error");
            status.classList.remove("completed");
            break;
        case FileStatus.Completed:
            status.textContent = "完了しました";
            status.classList.remove("error");
            status.classList.add("completed");
            break;
    }
};
//ipcRenderer.send('get-hash', "./index.html");

ipcRenderer.on('update-file-status', (event, index, fileStatus) => {
    updateFileStatus(index, fileStatus);
})
console.log(FileStatus.Blank)