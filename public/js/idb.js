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

    const history = budgetObjectStore.getAll();
    console.log(history);
    history.onsuccess = ()=> {
        fetch("/api/transaction/bulk",{
            method:"post",
            body:JSON.stringify(history.result),
            headers:{
                "Content-Type":"application/json"
            }
        } )
        .then(()=>)
    }
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
