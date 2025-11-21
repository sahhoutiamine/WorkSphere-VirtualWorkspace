let workers = [];

fetch("workers.json")
  .then((response) => {
    if (!response.ok) {
      throw Error("Error fetching data!");
    }
    return response.json();
  })
  .then((workersData) => {
    let workersList = workersData.workers;
    workersList.forEach((worker) => {
      workers.push(worker);
    });
  });
