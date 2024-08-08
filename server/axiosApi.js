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
export const addLineItem = (cartId, lineItem) => {
  return makeRequest("post", `carts/${cartId}/line-items`, lineItem)
};

export const addShippingCharges = (id, body) => {
  return makeRequest("post", `carts/${id}/shipping-methods`, body)
}

export const updateCart = (id, body) => {
  return makeRequest("post", `carts/${id}`, body);
  ;
}
export const createCheckOut = (id) => {
  return makeRequest("post", `carts/${id}/payment-sessions`);
};

export const confirmOrder = (id) => {
  return makeRequest("post", `carts/${id}/complete`);
};

export const getAllProducts = () => {
  return makeRequest("get", "products");
};

export const getProductReviews = (id) => {
  return makeRequest("get", `product-reviews?product_id=${id}`);
};

export const postProductReview = (body) => {
  return makeRequest("post", "product-reviews", body);
};

export const retrieveOrder = (id) => {
  return makeRequest("get", `orders/${id}`)
}

export const registerUser = (body) => {
  return makeRequest("post", "customers", body);
};

export const loginUser = (body) => {
  return makeRequest("post", "auth", body)
}
