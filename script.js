let workers = [];

fetch("workers.json")
  .then((response) => {
    if (!response.ok) {
      throw Error("Error fetching data!");
    }
    return response.json();
  })
  .then((workersData) => {
    console.log(workersData.workers);
    let workersList = workersData.workers;
    workersList.forEach((worker) => {
      console.log(worker);
      workers.push(worker);
    });
  });

console.log(workers);
