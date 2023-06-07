// ==UserScript==
// @name product-data-extractor
// @run-at document-idle
// @version 0.1.1
// @require ./bundle.js
// ==/UserScript==

console.log('product-data-extractor@0.1.1 loaded');

function main() {
  let data;
  try {
    data = window.WAE().parse(document.documentElement.outerHTML);
  } catch (error) {
    console.error(data);
    return false;
  }

  const productData = (data?.jsonld?.Product || data?.microdata?.Product || data?.rdfa?.Product)?.[0];
  if (!productData) {
    console.log('product-data-extractor: no product data found');
    return false;
  }
  injectButton(productData);
  return true;
}

let tries = 0;

while (tries++ < 3) {
  let result = main();
  if (result) {
    break;
  }

  console.log('Nothing found, retrying in 1.5s.');
  setTimeout(main, 1500);
}

function injectButton(data) {
  window.addStyle(`
    .pde-button {
      z-index: calc(9e999);
      position: fixed;
      margin-right: 16px;
      margin-bottom: 16px;
      bottom: 0;
      right:0;
      background-color: black;
      border-radius: 16px;
      font-size: 16px;
      color: white;
      padding: 8px;
      cursor: pointer;
      user-select: none;
      text-align: center;
      text-decoration: none;
      transition-duration: 0.4s;
      -webkit-transition-duration: 0.4s; /* Safari */
      border: none;
      font-size: 12px;
    }

    .pde-button:hover {
      transition-duration: 0.1s;
      opacity: 0.8;
    }

    .pde-button:after {
      content: "";
      display: block;
      position: absolute;
      border-radius: 40px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: all 0.5s;
      box-shadow: 0 0 10px 40px lightgrey;
    }

    .pde-button:active:after {
      box-shadow: 0 0 0 0 lightgrey;
      position: absolute;
      border-radius: 40px;
      left: 0;
      top: 0;
      opacity: 1;
      transition: 0s;
    }

    .pde-button:active {
      bottom: -2px;
    }
  `);

  const button = document.createElement('Button');
  button.classList.add('pde-button');
  button.innerHTML = '📋';
  button.title = 'Copy Product Data';
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(data));
  });
  document.body.appendChild(button);
}
