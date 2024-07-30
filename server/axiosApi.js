import { makeRequest } from "./instance";

export const getAllCategories = () => {
  return makeRequest("get", "product-categories");
};

export const getCategoryProducts = (id) => {
  return makeRequest("get", `products?category_id[0]=${id}`);
};
export const getProduct = (id) => {
  return makeRequest("get", `products/${id}`);
};

export const createCart = (body) => {
  return makeRequest("post", "carts", body);
};

export const getShippingMethod = (regionId) => {
  return makeRequest("get", `shipping-options?region_id=${regionId}`)
}

export const createOrder = (body) => {
  return makeRequest("post", "orders", body);
};

export const retrieveOrder = (id) => {
  return makeRequest("get", `orders/${id}`);
};

export const getAllProducts = () => {
  return makeRequest("get", "products");
};
