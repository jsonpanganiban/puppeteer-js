const car = require("./getCarList");

(async () => {
  await car.initialize();
  await car.getResult();
  //   debugger;
})();
