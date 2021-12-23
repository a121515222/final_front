
//DOM
const showProductlist = document.querySelector('.js-showProwlist');
const productlistCategory = document.querySelector('.js-productCategory');
const cartTable = document.querySelector('.js-carts');
const showCartEmpty = document.querySelector('.js-cartEmpty');
const totalPrice = document.querySelector('.js-price');
const showPrice = document.querySelector('.js-shoePrice');
const delAllCarts = document.querySelector('.js-delAll');
const errormessage = document.querySelector('.js-userinfo');
const userinfo = document.querySelectorAll('.js-userinfo .userdata');
const sendform = document.querySelector('.js-sendform');
const errorSapn = document.querySelectorAll('.js-userinfo span');
const userform = document.querySelector('.js-userform');
//全域變數

const apiPath = 'chun-chia'

//功能
function init() {
  getPorductList();
  getCartsList();
}

//取得產品列表

function getPorductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`).then((response) => {
    //console.log(response.data.products)
    renderProductList(response.data.products)
    renderPrductCategory(response.data.products)
  }).catch((error) => { console.log(error) });
}

function renderProductList(data) {
  let content = '';
  data.forEach((item) => {
    content += `<li class="card rounded-0 border-white flex-columl position-relative w-22 ">
  <div><img src=${item.images} alt="product"></div>
  <a href="#" data-id="${item.id}"  class="btn rounded-0 bg-dark text-white text-center py-3 hoverwhite border-dark">加入購物車</a>
  <span class="d-block fs-3">${item.title}</span>
  <span class="d-block fs-5"><s>NT${item.origin_price}</s></span>
  <span class="d-block fs-3">NT${item.price}</span>
  <div class="position-absolute top-0 end-0"><span class="d-block bg-dark text-white px-3 py2">新品</span></div>
</li>`
  });
  showProductlist.innerHTML = content;
}

function renderPrductCategory(data) {
  let category = [];
  let content = '<option value="all">所有分類</option>';
  data.forEach((item) => {
    if (category.indexOf(item.category) === -1) {
      category.push(item.category)
    }
  });
  category.forEach((item) => {
    content += `<option value="${item}">${item}</option>`
  });
  productlistCategory.innerHTML = content;
}
//選擇產品
function selPorduct() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`).then((response) => {

    let data = null;
    data = response.data.products.filter((item) => {
      if (productlistCategory.value === "all") {
        return item
      }
      else if (item.category === productlistCategory.value) {
        return item
      }

    })
    renderProductList(data)

  }).catch((error) => { console.log(error) });

}
//顯示購物車是否為空，如果購物車有東西開啟table與刪除所有按鈕
function showCartCompone(data) {
  if (data.length !== 0) {
    cartTable.classList.remove('d-none');
    showPrice.classList.remove('d-none');
    delAllCarts.classList.remove('d-none');
    showCartEmpty.classList.add('d-none');
  }
  else {
    cartTable.classList.add('d-none');
    showPrice.classList.add('d-none');
    delAllCarts.classList.add('d-none');
    showCartEmpty.classList.remove('d-none');
  }
}
//取得購物車
function getCartsList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`).then((response) => {

    //console.log(response.data.carts)
    renderCart(response.data)
  }).catch((error) => { console.log(error) });
}
//渲染購物車
function renderCart(data) {
  showCartCompone(data.carts)
  let content = `<thead><tr><th scope="col">品項</th><th scope="col">單價</th><th scope="col">數量</th><th scope="col">金額</th><th scope="col"></th></tr></thead><tbody>`;
  let contentTail = `</tbody>`;

  data.carts.forEach((item) => {
    content += `<tr class ="align-middle">
  <th scope="row" class="d-flex align-items-center gap-2"><div class="w-80px h-80px "><img src="${item.product.images}" alt=""></div><span
      class="fs- w-160px text-start">${item.product.title}</span></th>
  <td class="text-start"><span class="fs-6 ">${item.product.price}</span></td>
  <td class="text-start"><div class="d-flex gap-3"><a href="#"  ><i class="fas fa-minus fa-sm"data-cartid="${item.id}" data-quantity=${item.quantity - 1}></i></a><span class="fs-6" data-productid="${item.product.id}" data-cartID="${item.id}">${item.quantity}</span><a href="#"   ><i class="fas fa-plus fa-sm" data-cartid="${item.id}" data-quantity=${item.quantity + 1}></i></a></div></td>
  <td class="text-start"><span class="fs-6">${item.product.price * item.quantity}</span></td>
  <td class="text-start"><a href="#" data-productID="${item.product.id}" ><i class="fas fa-times" data-del=true data-cartid="${item.id}"></i></a></td>
</tr>`

  });
  cartTable.innerHTML = content + contentTail;

  totalPrice.textContent = data.finalTotal;
  //console.log(content + contentTail)

}

//加入購物車

function addCart(e) {
  e.preventDefault();

  let cartdata = null;
  let sentdata = {
    "data": {
      "productId": "",
      "quantity": 1
    }
  };
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`).then((response) => {
    

    cartdata = response.data.carts;
    //console.log(cartdata)
    //比較購物車數量如果已在購物車就加數量，如果不在購物車則加入
    cartdata.forEach((item) => {
      if (item.product.id.indexOf(e.target.dataset.id) !== -1) {
        sentdata.data.productId = e.target.dataset.id;
        sentdata.data.quantity = item.quantity + 1;
        console.log(sentdata.data.quantity)
      }
      else if(item.product.id.indexOf(e.target.dataset.id) === -1){
        sentdata.data.productId = e.target.dataset.id;
      };
    })
  
    console.log(sentdata.data.quantity);
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`, sentdata).then((response) => {
      renderCart(response.data)
    }).catch((error) => { console.log(error) })
  })




}
//刪除購物車
function delCart(e) {
  e.preventDefault()
  if (e.target.dataset.del === 'true') {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${e.target.dataset.cartid}`).then((response) => {
      renderCart(response.data)
    }).catch((error) => { console.log(error) })
  }
}
//刪除所有購物車
function delAllCart(e) {
  e.preventDefault()
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`).then((response) => {
    renderCart(response.data)
  }).catch((error) => { console.log(error) })
}
//購物車數量增減
function adjustCartNumber(e) {
  e.preventDefault();
  let sentdata = {
    "data": {
      "id": "",
      "quantity": 0
    }
  }

  sentdata.data.id = e.target.dataset.cartid
  sentdata.data.quantity = parseInt(e.target.dataset.quantity)
  if (e.target.dataset.del === 'true') {
    return
  }
  else {
    if (sentdata.data.quantity === 0) {
      axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${e.target.dataset.cartid}`).then((response) => {
        renderCart(response.data)
      }).catch((error) => { console.log(error) })
    }
    else {
      axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`, sentdata).then((response) => {
        renderCart(response.data)
      }).catch((error) => { console.log(error) })
    }
  }
}

//取得使用者資訊並送出

function getUserInfo(e) {
  e.preventDefault();
  const sentUserData = {
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
  userinfo.forEach((item) => {
    let objkey = Object.keys(sentUserData.data.user);
    objkey.forEach((i) => {
      if (item.getAttribute('id') === i) {
        sentUserData.data.user[i] = item.value;
      }
    })
  })
  //console.log(sentUserData)
  //console.log(sentUserData)
  displayError()
  if (!displayError()) {
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders
    `, sentUserData).then((response) => {
      if (response.data.status === true) {
        //alert('訂單已成功送出，感謝您的訂購')
        //console.log(response.data)
        userform.reset()
        getCartsList()
      }
    }).catch((error) => {
      console.log(error)
      if (error) {
        alert('購物車沒有東西或系統出錯，請稍後在試。')
      }
    })
  }
}

//validate.js套件
function displayError() {
  const constraints = {
    name: {
      presence: {
        message: "必填欄位"
      },
    },
    tel: {
      presence: {
        message: "必填欄位"
      }, format: {
        pattern: /\d{9,10}/,
        message: "請輸入純數字與完整的電話號碼"
      }
    },
    email: {
      presence: {
        message: "必填欄位"
      }, format: {
        pattern: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        message: "請輸入正確的email格式"
      }
    },
    address: {
      presence: {
        message: "必填欄位"
      },
    },
    payment: {
      presence: {
        message: "必選擇一種付款方式"
      },
    },
  }

  let errorMessage = validate(errormessage, constraints);
  //console.log(errorMessage)
  //顯示錯誤訊息

  errorSapn.forEach((item, index) => {

    if (errorMessage) {
      const errorObjkey = Object.keys(errorMessage);
      if (errorObjkey.indexOf(item.getAttribute('error')) !== -1) {
        errorSapn[index].textContent = errorMessage[item.getAttribute('error')][0]
      }
      else {
        errorSapn[index].textContent = "";
      }
    }
    else {
      errorSapn[index].textContent = "";
    }
  })
  return errorMessage
}

init()

//監聽
productlistCategory.addEventListener('change', selPorduct, false);
showProductlist.addEventListener('click', addCart, false);
cartTable.addEventListener('click', adjustCartNumber, false);
cartTable.addEventListener('click', delCart, false);
sendform.addEventListener('click', getUserInfo, false);
delAllCarts.addEventListener('click', delAllCart, false);