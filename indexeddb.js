var db;
var request = indexedDB.open("MyTestDatabase");
request.onerror = function(event) {
  alert("なぜ私の ウェブアプリで IndexedDB を使わせてくれないのですか?!");
};
request.onsuccess = function(event) {
  db = event.target.result;
};
db.onerror = function(event) {
  // このデータベースのリクエストに対するすべてのエラー用の
  // 汎用エラーハンドラ!
  alert("Database error: " + event.target.errorCode);
};

// このイベントは最新のブラウザーにのみ実装されています
request.onupgradeneeded = function(event) { 
  // IDBDatabase インターフェイスに保存します
  var db = event.target.result;

  // このデータベース用の objectStore を作成します
  var objectStore = db.createObjectStore("config", { keyPath: "name" });
  objectStore.createIndex("value", "value", { unique: false });
  objectStore.transaction.oncomplete = function(event) {
  // 新たに作成した objectStore に値を保存します。
  var configObjectStore = db.transaction("config", "readwrite").objectStore("config");
  for (var i in configData) {
    configObjectStore.add(configData[i]);
  }
};
function GetConfig(){
  var transaction = db.transaction(["config"]);
  let ofjectStore = transaction.objectStore("config");
  
  objectStore.openCursor().onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor){
      cursor.continue();
    } else {
      
    }
  }
  
};
function UpdateConfig (dic) {};
