const puppeteer = require("puppeteer");

const teste = async () => {
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

  console.log(rect);
  await page.screenshot({
    path: "cve-graphic.png",
    clip: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  });

  await browser.close();
};

teste();
