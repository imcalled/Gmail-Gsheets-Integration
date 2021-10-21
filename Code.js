// custom menu function
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom')
      .addItem('Update Inventory','saveData')
      .addToUi();
}

// TODO: adjust function to push data into Google Sheets
// function to save data
function saveData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var url = sheet.getRange('Sheet1!A1').getValue();
  var follower_count = sheet.getRange('Sheet1!B1').getValue();
  var date = sheet.getRange('Sheet1!C1').getValue();
  sheet.appendRow([url,follower_count,date]);
}

//enter search query
var SEARCH_QUERY = "label:inbox is:unread to:me";

//function to return emails according to search query
function getOrder()
{
  //var filter = "from:help_stylekorean@siliconii.net AND subject:K-Beauty & Korean Skin Care and Beauty Shop | Kbeauty NO.1 STYLEKOREAN.COM - Order Mail";
  var filter = "subject:(Kbeauty NO.1 STYLEKOREAN.COM Order Mail)"
  //returns array of threads
  var threads = GmailApp.search(filter, 0, 1);
  var orders = [];
  var htmlString = [];
  var productCompany = [];
  var productName;
  var productCompanyAndNameExtended = [];
  var productCompanyAndName = [];
  var productPrice = [];
  var productPriceExtended = [];

  //only \s or \" between > and []
  const getProductCompanyAndName = /(?<=(span\>))(.*)(?=(\<\/a))/g;
  const getProductPrice = /(?<=e9\"\>)((\d+.\d{2}))(?=\<)/g;
  // const getProductName = /(?<=\])([a-zA-Z0-9*\s]+[*]?)(?=\<)/g;
  const getProductCompany = /(?<=\[)(.*)(?=\])/g;
  const getProductName = /(\[)?(.*)(\])?/g;
  var name;

  for(let i of threads) {  
    orders = GmailApp.getMessagesForThread(i);
      for(let j of orders) {
        //Logger.log("message " + j + ": " + j.getBody())
        htmlString = j.getBody();
        //productCompany = getProductCompany.exec(htmlString);

        //Print truncated html
        // console.log(htmlString)

        productCompanyAndNameExtended = [...htmlString.matchAll(getProductCompanyAndName)];
        productName = [...htmlString.matchAll(getProductName)];
        productPriceExtended = [...htmlString.matchAll(getProductPrice)];
        product = [productCompany, productName, productPrice];

        if((productCompany && productName && productPrice) != null) {
          Logger.log('search successfull')
          Logger.log(productName.length)

          //Assign every other (even) element form productCompanyShort to productCompanyShort 
          for(let l = 0; l < productCompanyAndNameExtended.length; l+=2) {
            productCompanyAndName.push(productCompanyAndNameExtended[l][0])
          }
          Logger.log("productCompany length: " + productCompanyAndName)

          for(let product of productCompanyAndName) {
            if (product.includes('[')) {
              let name = product.replace(getProductName, '');
              Logger.log(name);
              productName.push(name);
            } else {
              productName.push(product);
            }

            // if(product.includes('[')) {

            //   productCompany.push(product.match(getProductCompany));
            // } else {
            //   productCompany.push(product);
            // } console.log(productCompany);
          }
          //get productPrice
          for(const pName of productName) {
            Logger.log(typeof pName)
            // Logger.log(pName[0]);
          }
          for(let l = 0; l < productPriceExtended.length; l +=2) {
            productPrice.push(productPriceExtended[l][0]);
          }
          // Logger.log("productPrice length: " + productPrice.length)


        }
    }
    //sheet.appendRow([date, productCompany])
  }
}
function getProductName(rawHTML) {

}

function getProductPrice(rawHTML) {
  
}

//   threads.forEach(function(thread)
//           {
//             orders.push(thread.getMessages()[0]);
//           });
//   return orders;
// }

// var thread = GmailApp.getInboxThreads(0, 1)[0];
// var messages = GmailApp.getMessagesForThread(thread);
// for (var i = 0 ; i < messages.length; i++) {
//   Logger.log("subject: " + messages[i].getSubject());
// }

// function getOrderDisplay()
// {
//   var templ = HtmlService.createTemplateFromFile('orders');
//   templ.orders = getOrder();
//   return templ.evaluate();
// }

// function doGet(e) {
//   //HtmlService - returns HTML from a script

//   return HtmlService
//     .createHtmlOutputFromFile('orders.html')//This is html file we want to render
//     .setTitle("Inventory test");//We can set title from here
// }
