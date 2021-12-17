"use strict";

//DOM
var showProductlist = document.querySelector('.js-showProwlist');
var productlistCategory = document.querySelector('.js-productCategory');
var cartTable = document.querySelector('.js-carts');
var totalPrice = document.querySelector('.js-price');
var delAllCarts = document.querySelector('.js-delAll');
var errormessage = document.querySelector('.js-userinfo');
var userinfo = document.querySelectorAll('.js-userinfo .userdata');
var sendform = document.querySelector('.js-sendform');
var errorSapn = document.querySelectorAll('.js-userinfo span');
var userform = document.querySelector('.js-userform'); //全域變數

var apiPath = 'chun-chia'; //功能

function init() {
  getPorductList();
  getCartsList();
} //取得產品列表


function getPorductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/products")).then(function (response) {
    //console.log(response.data.products)
    renderProductList(response.data.products);
    renderPrductCategory(response.data.products);
  })["catch"](function (error) {
    console.log(error);
  });
}

function renderProductList(data) {
  var content = '';
  data.forEach(function (item) {
    content += "<li class=\"card rounded-0 border-white flex-columl position-relative w-22 \">\n  <div><img src=".concat(item.images, " alt=\"product\"></div>\n  <a href=\"#\" data-id=\"").concat(item.id, "\"  class=\"btn rounded-0 bg-dark text-white text-center py-3 hoverwhite border-dark\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n  <span class=\"d-block fs-3\">").concat(item.title, "</span>\n  <span class=\"d-block fs-5\"><s>NT").concat(item.origin_price, "</s></span>\n  <span class=\"d-block fs-3\">NT").concat(item.price, "</span>\n  <div class=\"position-absolute top-0 end-0\"><span class=\"d-block bg-dark text-white px-3 py2\">\u65B0\u54C1</span></div>\n</li>");
  });
  showProductlist.innerHTML = content;
}

function renderPrductCategory(data) {
  var category = [];
  var content = '<option value="all">所有分類</option>';
  data.forEach(function (item) {
    if (category.indexOf(item.category) === -1) {
      category.push(item.category);
    }
  });
  category.forEach(function (item) {
    content += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  productlistCategory.innerHTML = content;
} //選擇產品


function selPorduct() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/products")).then(function (response) {
    var data = null;
    data = response.data.products.filter(function (item) {
      if (productlistCategory.value === "all") {
        return item;
      } else if (item.category === productlistCategory.value) {
        return item;
      }
    });
    renderProductList(data);
  })["catch"](function (error) {
    console.log(error);
  });
} //取得購物車


function getCartsList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts")).then(function (response) {
    //console.log(response.data.carts)
    renderCart(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
} //渲染購物車


function renderCart(data) {
  var content = "<thead><tr><th scope=\"col\">\u54C1\u9805</th><th scope=\"col\">\u55AE\u50F9</th><th scope=\"col\">\u6578\u91CF</th><th scope=\"col\">\u91D1\u984D</th><th scope=\"col\"></th></tr></thead><tbody>";
  var contentTail = "</tbody>";
  data.carts.forEach(function (item) {
    content += "<tr class =\"align-middle\">\n  <th scope=\"row\" class=\"d-flex align-items-center gap-2\"><div class=\"w-80px h-80px \"><img src=\"".concat(item.product.images, "\" alt=\"\"></div><span\n      class=\"fs- w-160px text-start\">").concat(item.product.title, "</span></th>\n  <td class=\"text-start\"><span class=\"fs-6 \">").concat(item.product.price, "</span></td>\n  <td class=\"text-start\"><div class=\"d-flex gap-3\"><a href=\"#\"  ><i class=\"fas fa-minus fa-sm\"data-cartid=\"").concat(item.id, "\" data-quantity=").concat(item.quantity - 1, "></i></a><span class=\"fs-6\" data-productid=\"").concat(item.product.id, "\" data-cartID=\"").concat(item.id, "\">").concat(item.quantity, "</span><a href=\"#\"   ><i class=\"fas fa-plus fa-sm\" data-cartid=\"").concat(item.id, "\" data-quantity=").concat(item.quantity + 1, "></i></a></div></td>\n  <td class=\"text-start\"><span class=\"fs-6\">").concat(item.product.price * item.quantity, "</span></td>\n  <td class=\"text-start\"><a href=\"#\" data-productID=\"").concat(item.product.id, "\" ><i class=\"fas fa-times\" data-del=true data-cartid=\"").concat(item.id, "\"></i></a></td>\n</tr>");
  });
  cartTable.innerHTML = content + contentTail;
  totalPrice.textContent = data.finalTotal; //console.log(content + contentTail)
} //加入購物車


function addCart(e) {
  e.preventDefault();
  var sentdata = {
    "data": {
      "productId": "",
      "quantity": 1
    }
  };
  sentdata.data.productId = e.target.dataset.id;
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts"), sentdata).then(function (response) {
    renderCart(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
} //刪除購物車


function delCart(e) {
  e.preventDefault();

  if (e.target.dataset.del === 'true') {
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts/").concat(e.target.dataset.cartid)).then(function (response) {
      renderCart(response.data);
    })["catch"](function (error) {
      console.log(error);
    });
  }
} //刪除所有購物車


function delAllCart(e) {
  e.preventDefault();
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts")).then(function (response) {
    renderCart(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
} //購物車數量增減


function adjustCartNumber(e) {
  e.preventDefault();
  var sentdata = {
    "data": {
      "id": "",
      "quantity": 0
    }
  };
  sentdata.data.id = e.target.dataset.cartid;
  sentdata.data.quantity = parseInt(e.target.dataset.quantity);

  if (e.target.dataset.del === 'true') {
    return;
  } else {
    if (sentdata.data.quantity === 0) {
      axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts/").concat(e.target.dataset.cartid)).then(function (response) {
        renderCart(response.data);
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      axios.patch("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts"), sentdata).then(function (response) {
        renderCart(response.data);
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }
} //取得使用者資訊並送出


function getUserInfo(e) {
  e.preventDefault();
  var sentUserData = {
    data: {
      user: {
        name: "",
        tel: "",
        email: "",
        address: "",
        payment: ""
      }
    }
  };
  userinfo.forEach(function (item) {
    var objkey = Object.keys(sentUserData.data.user);
    objkey.forEach(function (i) {
      if (item.getAttribute('id') === i) {
        sentUserData.data.user[i] = item.value;
      }
    });
  });
  console.log(sentUserData); //console.log(sentUserData)

  displayError();

  if (!displayError()) {
    axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/orders\n    "), sentUserData).then(function (response) {
      if (response.data.status === true) {
        alert('訂單已成功送出，感謝您的訂購');
        console.log(response.data);
        userform.reset();
        getCartsList();
      }
    })["catch"](function (error) {
      console.log(error);

      if (error) {
        alert('購物車沒有東西或系統出錯，請稍後在試。');
      }
    });
  }
} //validate.js套件


function displayError() {
  var constraints = {
    name: {
      presence: {
        message: "必填欄位"
      }
    },
    tel: {
      presence: {
        message: "必填欄位"
      },
      format: {
        pattern: /\d{9,10}/,
        flags: "i",
        message: "請輸入純數字與完整的電話號碼"
      }
    },
    email: {
      presence: {
        message: "必填欄位"
      }
    },
    address: {
      presence: {
        message: "必填欄位"
      }
    },
    payment: {
      presence: {
        message: "必選擇一種付款方式"
      }
    }
  };
  var errorMessage = validate(errormessage, constraints); //console.log(errorMessage)
  //顯示錯誤訊息

  errorSapn.forEach(function (item, index) {
    if (errorMessage) {
      var errorObjkey = Object.keys(errorMessage);

      if (errorObjkey.indexOf(item.getAttribute('error')) !== -1) {
        errorSapn[index].textContent = errorMessage[item.getAttribute('error')][0];
      } else {
        errorSapn[index].textContent = "";
      }
    }
  });
  return errorMessage;
}

init(); //監聽

productlistCategory.addEventListener('change', selPorduct, false);
showProductlist.addEventListener('click', addCart, false);
cartTable.addEventListener('click', adjustCartNumber, false);
cartTable.addEventListener('click', delCart, false);
sendform.addEventListener('click', getUserInfo, false);
delAllCarts.addEventListener('click', delAllCart, false);
//# sourceMappingURL=all.js.map
