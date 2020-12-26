const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

const tsa_website ='https://www.tsa.gov/coronavirus/passenger-throughput?page=0';
const html = `
<html>
    <body>
      <table>
      <tr><td>One</td><td>Two</td></tr>
      <tr><td>Three</td><td>Four</td></tr>
      </table>
    </body>
</html>`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(tsa_website, {waitUntil: 'networkidle2'});
  
  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => (td as HTMLElement).innerText)
  
});
function toarr(value, index, array){
    if (index%3==0){
    return [value, array[index+1], array[index+2]];
}}
const aoa = data.map(toarr);
const aoaFilt = aoa.filter(function(l){
    return l != null;
});
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(aoaFilt);

xlsx.utils.book_append_sheet(wb,ws); 


xlsx.writeFile(wb,"tsaTableUpdated2.xlsx");
  await browser.close()
})();