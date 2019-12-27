const puppeteer = require("puppeteer");

// await page.$eval(
//   "input[id=unifiedsearchinput]",
//   el => (el.value = "CVE-2019-5739")
// );
// await page.click('input[type="submit"]');

const cveDetails = async cve => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.cvedetails.com/cve/${cve}/`);

    const invlaidCVE = await page.evaluate(() => {
      return document.querySelector("#cvssscorestable");
    });

    if (invlaidCVE === null) {
      return new Error("Error: CVE invalida!");
    }

    const result = await page.$$eval("#cvssscorestable tr", trs =>
      trs.map(tr => {
        const th = tr.querySelector("th").textContent;
        const element = tr.querySelector("td").textContent;
        const data = {
          index: th.toUpperCase(),
          name: element
            .split("\t")
            .join("")
            .replace("\n", "")
        };
        return data;
      })
    );
    browser.close();
    const cveDetail = result.map(v => `🎯*${v.index}:* ${v.name}\n`);

    return cveDetail;
  } catch (error) {
    browser.close();
    return error;
  }
};

const cveGraphic = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://www.cvedetails.com/index.php");

  const rect = await page.$eval(".grid", () => {
    const element = document.querySelector(".grid");
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height };
  });

  const imgEncoding = await page.screenshot({
    clip: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    },
    encoding: "base64"
  });

  const imgBuffer = Buffer.from(imgEncoding, "base64");

  browser.close();
  return imgBuffer;
};

module.exports = {
  cveDetails,
  cveGraphic
};
