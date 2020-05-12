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
export function GetConfig(callback){
  var transaction = db.transaction(["config"]);
  let ofjectStore = transaction.objectStore("config");
  let dic = {};
  objectStore.openCursor().onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor){
      dic[cursor.key] = cursor.value.value;
      cursor.continue();
    } else {
      callback(dic);
    };
  };
};
export function updateConfig (dic, callback) {
  var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
  for (let key in dic) {
    var request = objectStore.get();
    request.onerror = function(event) {
      // エラー処理!
    };
    request.onsuccess = function(event) {
      // 更新したい、古い値を取得します。
      var data = request.result;
      // オブジェクト内の値を、希望する値に更新します。
      data.name = key;
      data.value = dic[key];

      // 更新したオブジェクトを、データベースに書き戻します。
      var requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
       // エラーが発生した場合の処理
      };
      requestUpdate.onsuccess = function(event) {
        console.log( "UpdateConfig success!");
       // 成功 - データを更新しました!
      };
    };
  };
};
