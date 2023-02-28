const productsData = [
  {
    id: 1,
    name: "Bateria Moura M26AD",
    bid: 28000,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria1.png",
  },
  {
    id: 2,
    name: "Bateria Willard Ub 740",
    bid: 32400,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria2.png",
  },

  {
    id: 3,
    name: "Bateria Prestolite PA45BD",
    bid: 22000,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria3.png",
  },

  {
    id: 4,
    name: "Bateria Varta VTA55DD",
    bid: 25000,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria4.png",
  },

  {
    id: 5,
    name: "Bateria Ac delco FD44RG",
    bid: 19000,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria5.png",
  },

  {
    id: 6,
    name: "Bateria Bosch GH345TT",
    bid: 16000,
    category: "baterias",
    cardImg: "./assets/img/productos/bateria6.png",
  },

  {
    id: 7,
    name: "Radiadores TYC",
    bid: 37500,
    category: "radiadores",
    cardImg: "./assets/img/productos/radiador1.png",
  },

  {
    id: 8,
    name: "Radiadores Konas",
    bid: 34500,
    category: "radiadores",
    cardImg: "./assets/img/productos/radiador2.png",
  },

  {
    id: 9,
    name: "Lampara led Philip h7",
    bid: 14000,
    category: "lamparas",
    cardImg: "./assets/img/productos/Luz1.png",
  },

  {
    id: 10,
    name: "Lampara led Philip h1",
    bid: 7000,
    category: "lamparas",
    cardImg: "./assets/img/productos/luz2.png",
  },

  {
    id: 11,
    name: "Escobillas Trico",
    bid: 3500,
    category: "escobillas",
    cardImg: "./assets/img/productos/escobillas1.png",
  },

  {
    id: 12,
    name: "Escobillas Bari",
    bid: 2700,
    category: "escobillas",
    cardImg: "./assets/img/productos/escobillas2.png",
  },
];

const splitProducts = (size) => {
  let dividedProducts = [];

  for (let i = 0; i < productsData.length; i += size) {
    dividedProducts.push(productsData.slice(i, i + size));
  }
  return dividedProducts;
};

const productsController = {
  dividedProducts: splitProducts(6),
  nextProductsIndex: 1,
  productsLimit: splitProducts(6).length,
};
