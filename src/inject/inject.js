var currentUrl = window.location.href;
chrome.runtime.sendMessage({ operation: 'getDetailsPathInPage', url: currentUrl }, function (response) {
    console.log('Got details in page');
    // TODO: Check with stocks if need to be shown
    var show = true;
    if (show) {
      showPopup()
  }
});


function getStockDetails(url) {
  console.log("Requesting stock details for " + url);

  // TODO: Make actual request...
  /* var response = $.ajax(
    {
      method: 'GET',
      url: 'https://api.backand.com/1/objects/action/Items/?name=getRelevant&parameters={"item":"' + model + '","price":"' + price + '"}',
      headers:
      {
        'AnonymousToken': '7bd597d9-86ba-41d6-ab63-f498c59fb2b9'
      }
    }
    );
  */
  console.log('getStockDetails request sent');

  response.fail(function (e) {
    console.error('ERROR getting stock details')
    console.log(e);
  });

  response.success(function (result) {
    if (result && result.length) {
      console.log('Got stock details');
      // TODO: Process request
      popupProduct(cheapest, price);
    }
    else {
      console.log('No response returned for getStockDetails request');
    }
  });
}

function popupProduct(product, originalPrice) {
  var myid = chrome.runtime.id;
  // TODO: Make it ours :)
  var headToInject = '<script src="chrome-extension://' + myid + '/js/jquery/jquery.min.js"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/normalize.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/demo.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/menu_topexpand.css"/>' +
    '<link rel="stylesheet" type="text/css" href="chrome-extension://' + myid + '/src/inject/css/buttons.css"/>';

  var scriptsToInject = '<script src="chrome-extension://' + myid + '/src/inject/js/classie.js"></script>' +
    '<script src="chrome-extension://' + myid + '/src/inject/js/main.js"></script>';

  var popupToInject = '<div style="background:#b4bad2" class="menu-wrap buytheway">' +
				'<nav style="background:#b4bad2" class="menu buytheway sticky navbar navbar-default navbar-fixed-top" >' +
    '<div class="center-vertical buytheway" style="padding-right:2em">' +
    '<span style="font-size:1.5em">מצאנו את המוצר זול ב- ' + (originalPrice - product.price) + '₪ ב' + product.name + '!</span>' +
    '</div>' +
    '<button id ="btn_newtab" class="buytheway center-vertical left button button--shikoba button--round-s button--border-thin button--size-l"><i class="button__icon icon"><img src="chrome-extension://' + myid + '/icons/newtabicon.png" /></i><span>תראה לי!</span></button>' +

    '<a href="#" id="btn_close" class="close-thin buytheway"></a>' +
				'</nav>' +
    '</div>';

  setTimeout(function () {
    $('head').append(headToInject);
    $('body').prepend('<h1>Hello World</h1>');
    $('body').prepend(popupToInject);

    setNewTabButtonTarget(product.url);
  }, 2000);


}

function setNewTabButtonTarget(url) {
  $("#btn_newtab").on('click', function () {
    window.open(url);
		});
}
