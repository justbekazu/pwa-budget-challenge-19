let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("budget_tracker", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    const transaction = db.transaction(["budget_tracker"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget_tracker");

    var history = budgetObjectStore.getAll();
    console.log(history);
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budget_tracker"], "readwrite");

  const budgetObjectStore = transaction.objectStore("budget_tracker");

  budgetObjectStore.add(record);
}
