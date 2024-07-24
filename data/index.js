import {
  getAllCategories,
  getCategoryProducts,
  getProduct,
} from "./../server/axiosApi";

export async function getStaticProps({ params }) {
  try {
    const categoriesRes = await getAllCategories();
    const categories = categoriesRes.product_categories || [];

    const productId = params?.productId;
    let product = null;
    if (productId) {
      const productRes = await getProduct(productId);
      product = productRes?.product || null;
    }

    const categoryId = params?.categoryId;
    let categoryProducts = [];
    if (categoryId) {
      const categoryProductsRes = await getCategoryProducts(categoryId);
      categoryProducts = categoryProductsRes?.products || [];
    }

    console.log("categories data ", categories);

    return {
      props: {
        categories,
        categoryProducts,
        product,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        categories: [],
        categoryProducts: [],
        product: null,
      },
    };
  }
}
