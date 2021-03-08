var currentUrl = window.location.href;
chrome.runtime.sendMessage({ operation: 'getDetailsPathInPage', url: currentUrl }, function (response) {
    console.log('Got details in page');
    tryShowPopup(currentUrl);
});

function getDomainFromUrl(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname.replace(".com", "").replace("www.", "");
}

function translateUrlToStockSymbol(url) {
    var sitename = getDomainFromUrl(url)
    console.log("SITENAME = " + sitename);
    var requestUrl =  'https://financialmodelingprep.com/api/v3/search?query=' + sitename + '&limit=10&apikey=demo';
    console.log("Requesting: " + requestUrl)
    var response = $.ajax(
    {
      method: 'GET',
      url: requestUrl,
      async: false
    });

    var responseObject = response.responseJSON;
    if (responseObject.length == 0) {
        return null;
    }
    return responseObject[0]['symbol'];
}

function tryShowPopup(currentUrl) {
  var myid = chrome.runtime.id;
  var stocksymbol = translateUrlToStockSymbol(currentUrl)
  if (stocksymbol === null) {
        console.log("Couldn't find a matching stock. Not showing")
        return;
  }

  console.log("Found stock symbol " + stocksymbol);
  // TODO: Make it ours :)
  var headToInject = '<script src="chrome-extension://' + myid + '/js/jquery/jquery.min.js"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/normalize.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/demo.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/menu_topexpand.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/buttons.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/css/bootstrap.min.css"/>' ;

  var scriptsToInject = '<script src="chrome-extension://' + myid + '/src/inject/js/classie.js"></script>' +
    '<script src="chrome-extension://' + myid + '/src/inject/js/main.js"></script>' +
    '<script src="chrome-extension://' + myid + '/js/bootstrap.min.js"></script>' +
    '<script>var link="https://api.stockdio.com/visualization/financial/charts/v1/PricesChange?app-key=01E29D3ADEC844F799CC7476C142A17B&symbol=' + stocksymbol + '&palette=Financial-Light&showLogo=Title";$(document).ready(function(){$("#btn_newtab").click(function(){$("#myModal").modal("show"),$("#graph").attr("src",link)})}); </script>';

  var popupToInject = '<div style="background:inherit" class="menu-wrap buytheway">' +
				'<nav style="background:inherit" class="menu buytheway sticky navbar navbar-default navbar-fixed-top" >' +
        "<iframe id='st_af7a75818bc7411cab50ef05fe0494a1' frameBorder='0' scrolling='no' width='100%' height='50%' src='https://api.stockdio.com/visualization/financial/charts/v1/Ticker?app-key=01E29D3ADEC844F799CC7476C142A17B&symbols=" + stocksymbol + ";AAPL;MSFT;GOOG;FB;ORCL&palette=Financial-Dark&layoutType=2&onload=st_af7a75818bc7411cab50ef05fe0494a1'></iframe>" +
    '<button id ="btn_newtab" class=" btn btn-sm btn-primary"><i class="button__icon icon"><img src="chrome-extension://' + myid + '/icons/newtabicon.png" /></i><span>לחצי כאן!</span></button>' +

    '<a href="#" id="btn_close" class="close-thin buytheway"></a>' +
				'</nav>' +
    '</div>' +
    `
    <div style="margin-top:60px;" id="myModal" class="modal fade bd-example-modal-lg" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                  <iframe frameBorder='0' scrolling='no' width='600' height='320' id="graph" src='https://api.stockdio.com/visualization/financial/charts/v1/PricesChange?app-key=01E29D3ADEC844F799CC7476C142A17B&symbol=TSLA&palette=Financial-Light&showLogo=Title'></iframe>
                  <div id='moreinfo_content'></div>
                </div>
            </div>
        </div>
    </div>

    `


    ;

  setTimeout(function () {
    $('head').append(headToInject);
    $('body').prepend(scriptsToInject);
    $('body').prepend(popupToInject);

    setupMoreInfoPopup(stocksymbol);
  }, 2000);


}

function setupMoreInfoPopup(stocksymbol) {
  console.log("Setting button onclick for symbol " + stocksymbol)
  var link = 'https://api.stockdio.com/visualization/financial/charts/v1/PricesChange?app-key=01E29D3ADEC844F799CC7476C142A17B&symbol='+stocksymbol+'&palette=Financial-Light&showLogo=Title'
    $("#btn_newtab").click(function(){
        $("#myModal").modal('show');
        $("#graph").attr('src', link);
    });

  var extraContent = ""
  var response = $.ajax(
    {
      method: 'GET',
      url: 'http://127.0.0.1:5000/request',
      headres: {
        'Access-Control-Allow-Origin': '*'
      },
      async: false
    });

    var responseText = response.responseText;
    if (responseText.length == 0) {
        console.error("Error while getting more info from server!")
    }

    $("#moreinfo_content").html(responseText);

}
