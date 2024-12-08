import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { invalidateCacheProps } from "../types/types.js";

const invalidateCache = async ({
  product,
  order,
  admin,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys = [
      "admin-products",
      "latest-products",
      "single-product",
      "categories",
      "all-products",
    ];
    const productsId = await Product.find({}).select("_id");
    productsId.forEach((id) => {
      productKeys.push(`product-${id}`);
    });
    nodeCache.del(productKeys);
  }
  if (order) {
    console.log("order cache is invalidated");
  }
  if (admin) {
    console.log("admin cache is invalidated");
  }
};

export default invalidateCache;
