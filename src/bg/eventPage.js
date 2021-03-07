var productsInSitesDetails = [
  {
    "site": ".*?www.traklin.co.il/product.asp?.*",
    "price": "//*[@id=\"product_details\"]/form/table/tbody/tr[1]/td[1]/table/tbody/tr[5]/td[1]/div[1]/span[2]",
    "model": "//*[@id=\"overDiv\"]/table/tbody/tr[5]/td[1]/span"
  },
  {
    "site": ".*?www.lastprice.co.il/product.asp?productid=.*",
    "price": "/html/body/div[4]/section[2]/div/div/div[2]/div[1]/div",
    "model": "/html/body/div[4]/section[2]/div/div/div[2]/h1"
  },
  {
    "site": ".*?www.pccenter.co.il/product/.*",
    "price": "//*[@id='total']",
    "model": "//*[@id='MainContentDiv']/div[3]/div/table/tbody/tr/td[2]/div/div/table/tbody/tr/td/table[2]/tbody/tr/td/div/div/div/div[2]/div[2]/div[1]/h1"
  },
  {
    "site": ".*?mispar1.co.il/pl_product.*",
    "price": "//*[@id='total']",
    "model": "//*[@id='MainContentDiv']/div[2]/div/table/tbody/tr/td[2]/div/div/table/tbody/tr/td/table[2]/tbody/tr/td/div/div/div/div[2]/div[1]/h1"
  },
  {
    "site": ".*?www.pc365.co.il/product-.*",
    "price": "/html/body/div[2]/div[2]/div[3]/div[3]/div[2]/div[4]/div[2]/div[3]/table/tbody/tr/td[2]/div/div[1]/b",
    "model": "//*[@id='product-title']"
  },
  {
    "site": ".*?www.electroshop.co.il/product.asp?ProductID=.*",
    "price": "//*[@id='AddToCart']/div[1]/table/tbody/tr[3]/td[4]",
    "model": "/html/body/div[4]/div[1]/div/section/div[1]/h2"
  },
  {
    "site": ".*?www.netoneto.co.il/product/.*",
    "price": "//*[@id='total']",
    "model": "//*[@id='MainContentDiv']/div[3]/div/table/tbody/tr/td[2]/div/div/table/tbody/tr/td/table[2]/tbody/tr/td/div/div/div/div[3]/h1"
  },
  {
    "site": ".*?store.dailysale.co.il/.*",
    "price": "//*[@id='plusprice']",
    "model": "/html/body/div[3]/div[7]/div[1]/span/span"
  },
  {
    "site": ".*www.tamlil2100.co.il/Product.aspx?pid=.*",
    "price": "//*[@id='cphBody_ucProduct_spanPriceSite']",
    "model": "//*[@id='cphBody_ucProduct_H1_H1']"
  },
  {
    "site": ".*?www.samgalelectric.co.il/pl_product~.*",
    "price": "//*[@id='total']",
    "model": "//*[@id='ItemPageTitle']/h3"
  },
  {
    "site": ".*?www.wallashops.co.il/.*",
    "price": "//*[@id='PriceAndBut2']/form/div/div/div/div",
    "model": "//*[@id='groupdealcontent2']/h1"
  },
  {
    "site": ".*?fre.co.il/.*",
    "price": "//*[@id='item_show_price']/span[2]/span",
    "model": "//*[@id='item_current_title']/h1/span"
  }
]

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.operation == 'getDetailsPathInPage') {

      for (var i = 0; i < productsInSitesDetails.length; i++) {
        var details = productsInSitesDetails[i];
        if (doesMatchRegex(details['site'], request.url)) {
          sendResponse({ modelPath: details['model'], pricePath: details['price'] });
        }
      }
    }
  });

function doesMatchRegex(pattern, str) {
  var re = new RegExp(pattern)
  var match;

  if ((match = re.exec(str)) !== null) {
    if (match.index === re.lastIndex) {
      re.lastIndex++;
    }
    return match[0];
  }
}