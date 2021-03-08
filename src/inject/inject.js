var currentUrl = window.location.href;
chrome.runtime.sendMessage({ operation: 'getDetailsPathInPage', url: currentUrl }, function (response) {
    console.log('Got details in page');
    // TODO: Check with stocks if need to be shown
    var show = true;
    if (show) {
      showPopup(currentUrl);
  }
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
    var response = $.ajax(
    {
      method: 'GET',
      url: 'https://financialmodelingprep.com/api/v3/search?query=' + sitename + '&limit=10&exchange=NASDAQ&apikey=demo',
      async: false
    });

    var responseObject = response.responseJSON;
    return responseObject[0]['symbol'];

}

function showPopup(currentUrl) {
  var myid = chrome.runtime.id;
  var stocksymbol = translateUrlToStockSymbol(currentUrl)
  console.log(stocksymbol)
  // TODO: Make it ours :)
  var headToInject = '<script src="chrome-extension://' + myid + '/js/jquery/jquery.min.js"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/normalize.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/demo.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/menu_topexpand.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/buttons.css"/>' +
    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">';

  var scriptsToInject = '<script src="chrome-extension://' + myid + '/src/inject/js/classie.js"></script>' +
    '<script src="chrome-extension://' + myid + '/src/inject/js/main.js"></script>'
    '<script>var stockSymbol="FB",link="https://api.stockdio.com/visualization/financial/charts/v1/PricesChange?app-key=01E29D3ADEC844F799CC7476C142A17B&symbol="+stockSymbol+"&palette=Financial-Light&showLogo=Title";$(document).ready(function(){$(".btn").click(function(){$("#myModal").modal("show"),$("#graph").attr("src",link)})}); </script>';

  var popupToInject = '<div style="background:#b4bad2" class="menu-wrap buytheway">' +
				'<nav style="background:#b4bad2" class="menu buytheway sticky navbar navbar-default navbar-fixed-top" >' +
    '<div class="center-vertical buytheway" style="padding-right:2em">' +
    '<span style="font-size:1.5em">SOME TEXT HERE</span>' +
    "<iframe id='st_af7a75818bc7411cab50ef05fe0494a1' frameBorder='0' scrolling='no' width='100%' height='100%' src='https://api.stockdio.com/visualization/financial/charts/v1/Ticker?app-key=01E29D3ADEC844F799CC7476C142A17B&symbols=AAPL;MSFT;GOOG;FB;ORCL&palette=Financial-Light&layoutType=2&onload=st_af7a75818bc7411cab50ef05fe0494a1'></iframe>" +
    '</div>' +
    '<button id ="btn_newtab" class="buytheway center-vertical left button button--shikoba button--round-s button--border-thin button--size-l"><i class="button__icon icon"><img src="chrome-extension://' + myid + '/icons/newtabicon.png" /></i><span>תראה לי!</span></button>' +

    '<a href="#" id="btn_close" class="close-thin buytheway"></a>' +
				'</nav>' +
    '</div>';

  setTimeout(function () {
    $('head').append(headToInject);
    $('body').prepend(scriptsToInject);
    $('body').prepend(popupToInject);

    setNewTabButtonTarget(currentUrl);
  }, 2000);


}

function setNewTabButtonTarget(url) {
  $("#btn_newtab").on('click', function () {
    window.open(url);
		});
}
