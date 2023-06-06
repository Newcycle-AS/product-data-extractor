window.WAE = require('@rane/web-auto-extractor').default;
window.addStyle = function (css) {
  var style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);
};
