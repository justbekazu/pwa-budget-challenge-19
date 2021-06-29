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
    history.onsuccess = () => {
      if (history.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(history.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          //opening a new transaction to save new data

          .then((server) => {
            if (server.message) {
              throw new Error(server);
            }

            const transaction = db.transaction(
              ["new_transaction"],
              "readWrite"
            );

            //accessing the "new" transaction db
            const transactionObjectStore =
              transaction.objectStore("new_transation");

            //clearing all items in the db
            transactionObjectStore.clear();
            alert("transactions have been saved");
          })

          .catch((err) => {
            console.log(err);
          });
      }
    };
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
