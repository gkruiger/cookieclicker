var settings = {
  clicksPerSecond: 100,
  buildsPerSecond: 1,
  upgradesPerSecond: 1
}

var timeoutClickCookie;
var timeoutBuilding;
var timeoutUpgrading;

function clickCookies() {
  clearTimeout(timeoutClickCookie);
  clickCookie();
}

function clickCookie() {
  document.getElementById('bigCookie').click();  
  timeoutClickCookie = setTimeout(clickCookie, 1000 / settings.clicksPerSecond);
}

function build() {
  // New building
  let idFromFirstNewBuilding = getIdFromFirstNewBuilding();
  if(idFromFirstNewBuilding != undefined) {
    document.getElementById(
      'productName' + idFromFirstNewBuilding
    ).click();
  }

  // Upgrade existing
  document.getElementById(
    'productName' + getIdWithBestRatio()
  ).click();
  timeout = setTimeout(build, 1000 / settings.buildsPerSecond);
}

function getIdFromFirstNewBuilding() {
  for(let i=0; i<17; i++) {
    let tooltip = Game.ObjectsById[i].tooltip();
    if(tooltip.indexOf('owned : 0') != -1) {
      return i;
    }
  }

  return undefined;
}

function getIdWithBestRatio() {
  let ratios = [];
  for(let i=0; i<17; i++) {
    ratios.push(
      getRatioFromTooltip(i)
    );
  }
  
  let maxRatio = Math.max(...ratios);
  return maxRatio == 0 ? 0 : ratios.indexOf(Math.max(...ratios));
}

function getRatioFromTooltip(id) {
  let tooltip = Game.ObjectsById[id].tooltip();

  // Get price
  tooltip = tooltip.slice(tooltip.search('price'));
  tooltip = tooltip.slice(tooltip.search('>')+1);
  let price = tooltip.slice(0, tooltip.search('<'));
  price = price.replace(',', '');

  // Multiply the price with the appropriate factor if necessary
  if(price.search(' ') > 0) {
    let factor = price.slice(price.search(' ') + 1);
    var factors = [
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion',
      'septillion',
      'octillion',
      'nonillion'
    ];
    let index = factors.indexOf(factor);
    let multiplier = 10 ** ((index+1)*3);
    price = price.slice(0, price.search(' '));
    price = price * multiplier;         
  }

  // Get extra clicks per second (cps)
  let cps = 0;
  if(tooltip.search('<b>') > 0) {
    tooltip = tooltip.slice(tooltip.search('<b>') + 3);
    cps = tooltip.slice(0, tooltip.search('<'));
    cps = parseFloat(cps.replace(/,/g, ''));
  }
  
  let ratio = cps / price;
  
  return ratio;
}

function keepBuilding() {
  clearTimeout(timeoutBuilding);
  build(); 
}

function upgrade() {
  let upgradeButton = document.getElementById('upgrade0');
  if(upgradeButton != null) {
    upgradeButton.click();
  }
  timeoutUpgrading = setTimeout(upgrade, 1000 / settings.upgradesPerSecond);
}

function keepUpgrading() {
  clearTimeout(timeoutUpgrading);
  upgrade(); 
}

clickCookies();
keepBuilding();
keepUpgrading();
