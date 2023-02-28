const products = document.querySelector(".products-container");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const categories = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");
const btnLoad = document.querySelector(".btn_load");
const buyBtn = document.querySelector(".btn_buy");
const cartBubble = document.querySelector(".cart_bubble");
const cartBtn = document.querySelector(".cart_label");
const barsBtn = document.querySelector(".menu_label");
const cartMenu = document.querySelector(".cart");
const barsMenu = document.querySelector(".navbar_list");
const overlay = document.querySelector(".overlay");
const successModal = document.querySelector(".add_modal");
const deleteBtn = document.querySelector(".btn_delete");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveLocalStorage = (cartList) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};

const renderProduct = (product) => {
  const { id, name, bid, cardImg } = product;
  return `
    <div class="product">
    <img src="${cardImg}" alt="${name}" />
    <div class="product_info">
        <!-- top -->
        <div class="product_top">
            <h3>${name}</h3>
       </div>
 
      <!-- mid -->
        <div class="product_mid">
            <span>$${bid}</span>
        </div>

        <!-- bot -->
        <div class="product_bot">
                <button
                    class="btn_add"
                    data-id="${id}"
                    data-name="${name}"
                    data-bid="${bid}"
                    data-img="${cardImg}"
                >
                    Agregar
                </button>
            </div>
        </div>
    </div>
</div>
`;
};

const renderDividedProducts = (index = 0) => {
  products.innerHTML += productsController.dividedProducts[index]
    .map(renderProduct)
    .join("");
};

const renderFilteredProducts = (category) => {
  const productsList = productsData.filter((product) => {
    return product.category === category;
  });
  products.innerHTML = productsList.map(renderProduct).join("");
};

const renderProducts = (index = 0, category = undefined) => {
  if (!category) {
    renderDividedProducts(index);
    return;
  }
  renderFilteredProducts(category);
};

const changeShowMoreBtnState = (category) => {
  if (!category) {
    btnLoad.classList.remove("hidden");
    return;
  }
  btnLoad.classList.add("hidden");
};

const changeBtnActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
};

const changeFilterState = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeShowMoreBtnState(selectedCategory);
  changeBtnActiveState(selectedCategory);
};

const applyFilter = (e) => {
  if (!e.target.classList.contains("category")) {
    return;
  } else {
    changeFilterState(e);
  }
  if (!e.target.dataset.category) {
    products.innerHTML = "";
    renderProducts();
  } else {
    renderProducts(0, e.target.dataset.category);
    productsController.nextProductsIndex = 1;
  }
};

const isLastIndexOf = () => {
  return (
    productsController.nextProductsIndex === productsController.productsLimit
  );
};

const showMoreProducts = () => {
  renderProducts(productsController.nextProductsIndex);
  productsController.nextProductsIndex++;
  if (isLastIndexOf()) {
    btnLoad.classList.add("hidden");
  }
};

const toggleMenu = () => {
  barsMenu.classList.toggle("open_menu");
  if (cartMenu.classList.contains("open_cart")) {
    cartMenu.classList.remove("open_cart");
    return;
  }
  overlay.classList.toggle("show_overlay");
};

const toggleCart = () => {
  cartMenu.classList.toggle("open_cart");
  if (barsMenu.classList.contains("open_menu")) {
    barsMenu.classList.remove("open_menu");
    return;
  }
  overlay.classList.toggle("show_overlay");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) {
    return;
  }
  barsMenu.classList.remove("open_menu");
  overlay.classList.remove("show_overlay");
};

const closeOnScroll = () => {
  if (
    !barsMenu.classList.contains("open_menu") &&
    !cartMenu.classList.contains("open_cart")
  ) {
    return;
  }
  barsMenu.classList.remove("open_menu");
  cartMenu.classList.remove("open_cart");
  overlay.classList.remove("show_overlay");
};

const closeOnOverlayClick = () => {
  barsMenu.classList.remove("open_menu");
  cartMenu.classList.remove("open_cart");
  overlay.classList.remove("show_overlay");
};

const renderCardProduct = (cartProduct) => {
  const { id, name, bid, img, quantity } = cartProduct;
  return `
  <div class="cart-item">
  <img src=${img} alt="Img del carrito" />
  <div class="item-info">
  <h3 class="item-title">${name}</h3>
  <p class="item-bid">Precio</p>
  <span class="item-price">$${bid} </span>
  </div>
  <div class="item-handler">
  <span class="quantity-handler down"
  data-id=${id}>-</span>
  <span class="item-quantity">${quantity}</span>
  <span class="quantity-handler up" data-id=${id}>+</span>
  </div>
  </div>
  `;
};
const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty_msg">El carrito esta vacio.</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(renderCardProduct).join("");
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => {
    return acc + Number(cur.bid) * cur.quantity;
  }, 0);
};

const showTotal = () => {
  total.innerHTML = `${getCartTotal().toFixed(2)}$`;
};

const renderCartBubble = () => {
  cartBubble.textContent = cart.reduce((acc, cur) => {
    return acc + cur.quantity;
  }, 0);
};

const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const checkCartState = () => {
  saveLocalStorage(cart);
  renderCart();
  showTotal();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
  renderCartBubble();
};

const addProduct = (e) => {
  if (!e.target.classList.contains("btn_add")) {
    return;
  }

  const { id, name, bid, img } = e.target.dataset;

  const product = productData(id, name, bid, img);

  if (isExistingCartProduct(product)) {
    addUnitToProduct(product);
    showSuccessModal("Se agrego una unidad de este producto");
  } else {
    createCartProduct(product);
    showSuccessModal("Se agrego este producto al carrito");
  }
  checkCartState();
};

const productData = (id, name, bid, img) => {
  return { id, name, bid, img };
};

const isExistingCartProduct = (product) => {
  return cart.find((item) => {
    return item.id === product.id;
  });
};

const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

const showSuccessModal = (msg) => {
  successModal.classList.add("active_modal");
  successModal.textContent = msg;
  setTimeout(() => {
    successModal.classList.remove("active_modal");
  }, 1500);
};

const createCartProduct = (product) => {
  cart = [
    ...cart,
    {
      ...product,
      quantity: 1,
    },
  ];
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => {
    return item.id === id;
  });

  if (existingCartProduct.quantity === 1) {
    if (window.confirm("¿Quiere eliminar este producto?")) {
      removeProductFromCart(existingCartProduct);
    }
    return;
  }

  substractProductUnit(existingCartProduct);
};

const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => {
    return item.id === id;
  });

  addUnitToProduct(existingCartProduct);
};

const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  checkCartState();
};

const substractProductUnit = (existingProduct) => {
  cart = cart.map((product) => {
    return product.id === existingProduct.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const handleQuantity = (e) => {
  if (e.target.classList.contains("down")) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtnEvent(e.target.dataset.id);
  }
  checkCartState();
};

const resetCartItems = () => {
  cart = [];
  checkCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};

const completeBuy = () => {
  completeCartAction(
    "¿Quiere terminar su compra?",
    "Muchas gracias por comprar en nuestra pagina!"
  );
};

const deleteCart = () => {
  completeCartAction("¿Quiere vaciar su carrito?", "Carrito vacio");
};

const init = () => {
  renderProducts();
  categories.addEventListener("click", applyFilter);
  btnLoad.addEventListener("click", showMoreProducts);
  barsBtn.addEventListener("click", toggleMenu);
  cartBtn.addEventListener("click", toggleCart);
  barsMenu.addEventListener("click", closeOnClick);
  window.addEventListener("scroll", closeOnScroll);
  overlay.addEventListener("click", closeOnOverlayClick);
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", showTotal);
  products.addEventListener("click", addProduct);
  productsCart.addEventListener("click", handleQuantity);
  buyBtn.addEventListener("click", completeBuy);
  deleteBtn.addEventListener("click", deleteCart);
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
  renderCartBubble();
};

init();
