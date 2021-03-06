const puppeteer = require("puppeteer");

const cars = {
  browser: null,
  page: null,

  initialize: async () => {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "--proxy-server=http://x.botproxy.net:8080",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        // "--window-size=1920,1080",
      ],
    });

    this.page = await this.browser.newPage();
    await this.page.authenticate({
      username: "pxu21186-1",
      password: "",
    });
    await this.page.setRequestInterception(true);

    const blockedResourceTypes = [
      "image",
      "stylesheet",
      "media",
      "font",
      "texttrack",
      "object",
      "beacon",
      "csp_report",
      "imageset",
    ];

    const skippedResources = [
      "quantserve",
      "adzerk",
      "doubleclick",
      "adition",
      "exelator",
      "sharethrough",
      "cdn.api.twitter",
      "google-analytics",
      "googletagmanager",
      "google",
      "fontawesome",
      "facebook",
      "analytics",
      "optimizely",
      "clicktale",
      "mixpanel",
      "zedo",
      "clicksor",
      "tiqcdn",
    ];

    const url =
      "https://www.copart.com/lotSearchResults/?searchCriteria=%7B%22query%22:%5B%22*%22%5D,%22filter%22:%7B%22MAKE%22:%5B%22lot_make_desc:%5C%22ALFA%20ROMEO%5C%22%22%5D%7D,%22sort%22:%5B%22auction_date_type%20desc%22,%22auction_date_utc%20asc%22%5D,%22watchListOnly%22:false,%22searchName%22:%22%22,%22freeFormSearch%22:false%7D";

    this.page.on("request", async (request) => {
      const requestUrl = request.url().split("?")[0].split("#")[0];
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
        skippedResources.some((resource) => requestUrl.indexOf(resource) !== -1)
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.goto(url, { waitUntil: "networkidle2" });
    await this.page.waitForSelector(
      '#serverSideDataTable_processing[style="display: none;"]'
    );
  },

  getResult: async () => {
    let carResult = await cars.parseResult();
    while (
      (await this.page.$eval("#serverSideDataTable_next", (el) =>
        el.getAttribute("class")
      )) != "paginate_button next disabled"
    ) {
      await this.page.click("#serverSideDataTable_next");
      await this.page.waitForSelector(
        '#serverSideDataTable_processing[style="display: none;"]'
      );
      newResult = await cars.parseResult();
      carResult = [...carResult, ...newResult];
      console.log(carResult);
    }

    await this.browser.close();

    return carResult;
  },

  parseResult: async () => {
    const carTable = "#serverSideDataTable tbody tr";
    const carDetails = await this.page.$$eval(carTable, (nodes) => {
      return nodes.map((node) => {
        const lotsearchLotimage = node
          .querySelector('[data-uname="lotsearchLotimage"]')
          .getAttribute("lazy-src");
        const lotsearchLotnumber = node.querySelector(
          '[data-uname="lotsearchLotnumber"]'
        ).textContent;
        const lotsearchLotcenturyyear = node.querySelector(
          '[data-uname="lotsearchLotcenturyyear"]'
        ).textContent;
        const lotsearchLotmake = node.querySelector(
          '[data-uname="lotsearchLotmake"]'
        ).textContent;
        const lotsearchLotmodel = node.querySelector(
          '[data-uname="lotsearchLotmodel"]'
        ).textContent;
        const lotsearchItemnumber = node.querySelector(
          '[data-uname="lotsearchItemnumber"]'
        ).textContent;
        const lotsearchLotyardname = node.querySelector(
          '[data-uname="lotsearchLotyardname"]'
        ).textContent;
        const lotsearchLotauctiondate = node.querySelector(
          '[data-uname="lotsearchLotauctiondate"]'
        ).textContent;
        const lotsearchLotodometerreading = node.querySelector(
          '[data-uname="lotsearchLotodometerreading"]'
        ).textContent;
        const lotsearchSaletitletype = node.querySelector(
          '[data-uname="lotsearchSaletitletype"]'
        ).textContent;
        const lotsearchLotdamagedescription = node.querySelector(
          '[data-uname="lotsearchLotdamagedescription"]'
        ).textContent;
        const lotsearchLotestimatedretailvalue = node.querySelector(
          '[data-uname="lotsearchLotestimatedretailvalue"]'
        ).textContent;
        //   const lotsearchLothighbid = node.querySelector(
        //     '[data-uname="lotsearchLothighbid"]'
        //   ).textContent;
        return {
          lotsearchLotimage: lotsearchLotimage,
          lotsearchLotnumber: lotsearchLotnumber,
          lotsearchLotcenturyyear: lotsearchLotcenturyyear,
          lotsearchLotmake: lotsearchLotmake,
          lotsearchLotmodel: lotsearchLotmodel,
          lotsearchItemnumber: lotsearchItemnumber,
          lotsearchLotyardname: lotsearchLotyardname,
          lotsearchLotauctiondate: lotsearchLotauctiondate,
          lotsearchLotodometerreading: lotsearchLotodometerreading,
          lotsearchSaletitletype: lotsearchSaletitletype,
          lotsearchLotdamagedescription: lotsearchLotdamagedescription,
          lotsearchLotestimatedretailvalue: lotsearchLotestimatedretailvalue,
          // lotsearchLothighbid: lotsearchLothighbid.trim(),
        };
      });
    });
    return carDetails;
  },
};

module.exports = cars;
