const puppeteer = require('puppeteer');



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


const prompt = require('prompt-sync')();
const date1 = prompt('what from date are you looking for? (mo/date/year)');
const date2 = prompt('what to date are you looking for? (mo/date/year)');

function finddate1(arr){
    if(arr[0]==date1){return true;}
    else return false;
}

function finddate2(arr){
    if(arr[0]==date2){return true;}
    else return false;
}
var ind1= aoaFilt.findIndex(finddate1);
var ind2= aoaFilt.findIndex(finddate2);

if(ind1<ind2){  //making sure ind1 is the earlier date
    let temp = ind1;
    ind1 = ind2;
    ind2 = temp;
}


console.log(ind1);
console.log(ind2);
var ind = ind1;
while(ind>=ind2){
    console.log("Traveler number for",aoaFilt[ind][0],":", aoaFilt[ind][1], " Traveler number for same date last year: ", aoaFilt[ind][2]);
    ind=ind-1;
}

  await browser.close()
})();