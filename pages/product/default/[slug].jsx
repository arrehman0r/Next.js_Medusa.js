import React, { useEffect, useState } from "react";

import Helmet from "react-helmet";
import OwlCarousel from "~/components/features/owl-carousel";
import MediaOne from "~/components/partials/product/media/media-one";
import DetailOne from "~/components/partials/product/detail/detail-one";
import DescOne from "~/components/partials/product/desc/desc-one";
import RelatedProducts from "~/components/partials/product/related-products";
import { mainSlider17 } from "~/utils/data/carousel";
import { getProduct } from "~/server/axiosApi";
import { getAllProducts } from "../../../server/axiosApi";

export async function getStaticPaths() {
  // Fetch a list of all product IDs from your backend (adjust the API endpoint as needed)
  const productsRes = await getAllProducts();
  const products = productsRes?.products
  // Extract IDs from products and convert them to strings
  const paths = products.map((product) => ({
    params: { slug: String(product.id) },
  }));

  // Set fallback: 'blocking' or 'blocking' to handle missing paths (optional)
  return { paths, fallback: false }; // No fallback generation for missing paths here
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  try {
    const productRes = await getProduct(slug);
    const product = productRes?.product;
    
    // Ensure related_ids is defined and is an array before mapping
    const relatedProducts = product && Array.isArray(product.related_ids)
      ? await Promise.all(
          product.related_ids.map(async (id) => await getProduct(id))
        )
      : [];

    return { props: { product, relatedProducts } };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      props: { product: null, relatedProducts: [] },
      notFound: true,
    };
  }
}


function ProductDefault({ product, relatedProducts }) {
  const [loaded, setLoadingState] = useState(true);
console.log("product from default page", product)
  useEffect(() => {
    if (product) {
      setLoadingState(false);
    }
  }, [product]);

  return (
    <main className="main mt-6 single-product">
      <Helmet>
        <title>Party Shope Web Store | Product Default</title>
      </Helmet>

      <h1 className="d-none">Party Shope Web Store - Product Default</h1>

      {product ? (
        <div className={`page-content mb-10 pb-6 ${loaded ? "d-none" : ""}`}>
          <div className="container vertical">
            <div className="product product-single row mb-7">
              <div className="col-md-6 sticky-sidebar-wrapper">
                <MediaOne product={product} />
              </div>

              <div className="col-md-6">
                <DetailOne product={product} />
              </div>
            </div>
            {console.log("this is single product", product)}
            <DescOne product={product} />
            {relatedProducts &&
              <RelatedProducts products={relatedProducts} />}
          </div>
        </div>
      ) : (
        <div className="skeleton-body container mb-10">
          <div className="row mb-7">
            <div className="col-md-6 pg-vertical">
              <div className="skel-pro-gallery"></div>
            </div>

            <div className="col-md-6">
              <div className="skel-pro-summary"></div>
            </div>
          </div>

          <div className="skel-pro-tabs"></div>
        </div>
      )}
      {/* <section className="pt-3 mt-4">
                    <h2 className="title justify-content-center">Related Products</h2>

                    <OwlCarousel adClass="owl-carousel owl-theme owl-nav-full" options={ mainSlider17 }>
                        {
                          relatedProducts.map( ( item ) =>
                                <div className="product-loading-overlay" key={ 'popup-skel-' + item }>

                                  {item.title}
                                </div>
                            )
                        }
                    </OwlCarousel>
                </section>  */}
    </main>
  );
}

// export default withApollo( { ssr: typeof window === 'undefined' } )( ProductDefault );
export default ProductDefault;
