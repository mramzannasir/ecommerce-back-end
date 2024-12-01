// import { faker } from "@faker-js/faker";
// import { Product } from "../models/product.js";

// const generateFakeProducts = async () => {
//   const products = [];
//   for (let i = 0; i < 80; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       description: faker.lorem.paragraph(),
//       price: faker.commerce.price(),
//       photo: "uploads\\679a0dc5-2314-4c7f-9e4e-82454b000a2a.jpg",
//       category: faker.commerce.department(),
//       stock: faker.commerce.price(),
//     };
//     products.push(product);
//   }
//   await Promise.all(products.map((product) => Product.create(product)));
//   return products;
// };

// //   app.get("/api/v1/products/fake", (req, res) => {
// //     const fakeProducts = generateFakeProducts();
// //     res.json(fakeProducts);
// //   });
