const { performance } = require("perf_hooks");

const car = require("./getCarList");

(async () => {
  const start_time = performance.now();

  await car.initialize();
  await car.getResult();

  const end_time = performance.now();

  const total_time = end_time - start_time;

  process.stdout.write(`Total Time: ${total_time} ms`);
  process.exit();
  //   debugger;
})();
