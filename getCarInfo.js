const puppeteer = require("puppeteer");

const getLotInfo = async (lotNumber) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    ],
  });

  const url = `https://www.copart.com/lot/${lotNumber}`;
  const page = await browser.newPage();
  await page.goto(url);

  const lotInformation = await page.evaluate(() => {
    const vin = document.querySelector('[data-uname="lotdetailVinvalue"] span')
      .innerText;
    const docType = document.querySelector(
      '[data-uname="lotdetailTitledescriptionvalue"] p'
    ).innerText;
    const odometer = document.querySelector(
      '[data-uname="lotdetailOdometervalue"] p'
    ).innerText;
    const highlights = document.querySelector(
      '[data-uname="lotdetailHighlights"]'
    ).innerText;
    const primaryDamage = document.querySelector(
      '[data-uname="lotdetailPrimarydamagevalue"]'
    ).innerText;
    const secondaryDamage = document.querySelector(
      '[data-uname="lotdetailSecondarydamageValue"]'
    )
      ? document.querySelector('[data-uname="lotdetailSecondarydamageValue"]')
          .innerText
      : "";
    const imgUrls = Array.from(
      document.querySelectorAll(".thumbImgblock img")
    ).map((img) => img.src);

    return {
      vin: vin,
      docType: docType,
      odometer: odometer,
      highlights: highlights,
      primaryDamage: primaryDamage,
      secondaryDamage: secondaryDamage,
      imgUrls: imgUrls,
    };
  });

  console.log(lotInformation);
  await browser.close();
};

getLotInfo(23325718);
