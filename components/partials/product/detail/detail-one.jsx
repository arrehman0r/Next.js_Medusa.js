import { connect } from "react-redux";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import ALink from "~/components/features/custom-link";
import Countdown from "~/components/features/countdown";
import Quantity from "~/components/features/quantity";
import ProductNav from "~/components/partials/product/product-nav";
import { wishlistActions } from "~/store/wishlist";
import { cartActions } from "~/store/cart";
import { toDecimal } from "~/utils";
import ShippingTime from "~/components/features/shipping";
import FreeReturn from "~/components/features/free-returns";
import QuickviewModal from "~/components/features/product/common/quickview-modal";

function DetailOne(props) {
  let router = useRouter();
  const {
    data,
    isStickyCart = false,
    adClass = "",
    isNav = true,
    product,
    reviews
  } = props;
  const { toggleWishlist, addToCart, wishlist } = props;
  const [curColor, setCurColor] = useState("null");
  const [curSize, setCurSize] = useState("null");
  const [curIndex, setCurIndex] = useState(-1);
  const [cartActive, setCartActive] = useState(false);
  const [quantity, setQauntity] = useState(1);
  const [fbEventFire, setfbEventFire] = useState(false);
  const [openBuyNow, setOpenBuyNow] =  useState(false)
  // let product = data && product;

  // decide if the product is wishlisted
  let isWishlisted,
    colors = [],
    sizes = [];
  isWishlisted =
    wishlist.findIndex((item) => item.id === product.id) > -1 ? true : false;

  if (product && product.variants.length > 0) {
    if (product.variants[0].size)
      product.variants.forEach((item) => {
        if (sizes.findIndex((size) => size.title === item.size.title) === -1) {
          sizes.push({ name: item.size.title, value: item.size.size });
        }
      });

    if (product.variants[0].color) {
      product.variants.forEach((item) => {
        if (colors.findIndex((color) => color.title === item.color.title) === -1)
          colors.push({ name: item.color.title, value: item.color.color });
      });
    }
  }

  useEffect(() => {
    return () => {
      setCurIndex(-1);
      resetValueHandler();
    };
  }, [product]);

  useEffect(() => {
    if (product.variants.length > 0) {
      if (
        (curSize !== "null" && curColor !== "null") ||
        (curSize === "null" &&
          product.variants[0].size === null &&
          curColor !== "null") ||
        (curColor === "null" &&
          product.variants[0].color === null &&
          curSize !== "null")
      ) {
        setCartActive(true);
        setCurIndex(
          product.variants.findIndex(
            (item) =>
              (item.size !== null &&
                item.color !== null &&
                item.color.title === curColor &&
                item.size.title === curSize) ||
              (item.size === null && item.color.title === curColor) ||
              (item.color === null && item.size.title === curSize)
          )
        );
      } else {
        setCartActive(false);
      }
    } else {
      setCartActive(true);
    }

    if (product.variants[0].inventory_quantity > 0) {
      setCartActive(true);
    }
  }, [curColor, curSize, product]);

  const wishlistHandler = (e) => {
    e.preventDefault();

    if (toggleWishlist && !isWishlisted) {
      let currentTarget = e.currentTarget;
      currentTarget.classList.add("load-more-overlay", "loading");
      toggleWishlist(product);

      setTimeout(() => {
        currentTarget.classList.remove("load-more-overlay", "loading");
      }, 1000);
    } else {
      router.push("/pages/wishlist");
    }
  };

  console.log("product====",product)

  const setColorHandler = (e) => {
    setCurColor(e.target.value);
  };

  const setSizeHandler = (e) => {
    setCurSize(e.target.value);
  };
  const triggerFacebookPixelAddToCartEvent = (product) => {

    if (window.fbq && !fbEventFire) {
      console.log("fb pixelmeee", window.fbq)
      window.fbq('track', 'AddToCart', {
        content_name: product.title,
        content_ids: product.variants[0].id,
        content_type: 'product',
        value: product.variants[0]?.prices[1]?.amount || product.variants[0]?.prices[0]?.amount || 0,
        currency: 'PKR',
        quantity: product.qty
      });
      setfbEventFire(true)
    }
  };

  const addToCartHandler = () => {
    if (product.variants[0].inventory_quantity > 0 && cartActive) {
      let tmpName = product.title,
        tmpPrice;

      tmpName += curColor !== "null" ? "-" + curColor : "";
      tmpName += curSize !== "null" ? "-" + curSize : "";

      if (product.variants[0]?.prices[1]?.amount === product.variants[0]?.prices[0]?.amount) {
        tmpPrice = product.variants[0]?.prices[1]?.amount;
      } else if (
        !product.variants[0].prices[1]?.amount &&
        product.variants[0]?.prices[0]?.amount > 0
      ) {
        tmpPrice = product.variants[0]?.prices[1]?.amount;
      } else {
        tmpPrice = product.variants[0].prices[0]?.amount
          ? product.variants[0].prices[1]?.amount
          : product.variants[0].prices[0]?.amount;
      }

      const addToCartItem = {
        ...product,
        name: tmpName,
        qty: quantity,
        sale_price: tmpPrice,
      };

      addToCart(addToCartItem);
      triggerFacebookPixelAddToCartEvent(addToCartItem);
    }
  };
  const resetValueHandler = (e) => {
    setCurColor("null");
    setCurSize("null");
  };

  function isDisabled(color, size) {
    if (color === "null" || size === "null") return false;

    if (sizes.length === 0) {
      return (
        product.variants.findIndex((item) => item.color.title === curColor) ===
        -1
      );
    }

    if (colors.length === 0) {
      return (
        product.dvariations.findIndex((item) => item.size.title === curSize) ===
        -1
      );
    }

    return (
      product.variants.findIndex(
        (item) => item.color.title === color && item.size.title === size
      ) === -1
    );
  }

  function changeQty(qty) {
    setQauntity(qty);
  }

  const handleBuyNow = () => {
    // console.log("Before setOpenBuyNow:", openBuyNow);
    setOpenBuyNow(!openBuyNow);
    // console.log("After setOpenBuyNow:", openBuyNow);
};


  return (
    <div className={"product-details " + adClass}>
      {isNav ? (
        <div className="product-navigation">
          <ul className="breadcrumb breadcrumb-lg">
            <li>
              <ALink href="/">
                <i className="d-icon-home"></i>
              </ALink>
            </li>
            <li>
              <ALink href="#" className="active">
                Products
              </ALink>
            </li>
            <li>Detail</li>
          </ul>

          <ProductNav product={product} />
        </div>
      ) : (
        ""
      )}

      <h2 className="product-name">{product?.title}</h2>
      {/* 
      <div className="product-meta">
        SKU: <span className="product-sku">{product?.sku}</span>
        CATEGORIES:
        <span className="product-brand">
          {product.categories.map((item, index) => (
            <React.Fragment key={item.title + "-" + index}>
              {index > 0 && ", "}{" "}
            
              {item.title}
            </React.Fragment>
          ))}
        </span>
      </div> */}
      <FreeReturn />
      <div className="product-price mb-2">
        {product && product.variants[0]?.prices[1]?.amount !== product.variants?.[0]?.prices[0]?.amount ? (
          product.variants.length === 0 ||
            (product.variants.length > 0 && product.variants[0]?.prices[1]?.amount) ? (
            <>
              <ins className="new-price">Rs.{product.variants[0]?.prices[1]?.amount}</ins>
              <del className="old-price">Rs.{product.variants[0]?.prices[0]?.amount}</del>
            </>
          ) : (
            <del className="new-price">
              Rs.{toDecimal(product.variants[0]?.prices[1]?.amount)} – Rs.
              {toDecimal(product.variants[0]?.prices[0]?.amount)}
            </del>
          )
        ) : (
          <ins className="new-price">Rs.{toDecimal(product?.variants[0]?.prices[0]?.amount)}</ins>
        )}
      </div>


      {product?.variants[0]?.prices[1]?.amount !== product?.variants[0]?.prices[0]?.amount
        ? (
          <Countdown type={2} />
        ) : (
          ""
        )}
      <div>
        <ShippingTime />
      </div>
      { reviews && 
      <div className="ratings-container">
        <div className="ratings-full">
          <span
            className="ratings"
            style={{ width: 20 * reviews[0]?.ratings + "%" }}
          ></span>
          <span className="tooltiptext tooltip-top">
            {toDecimal(reviews[0]?.ratings)}
          </span>
        </div>

        <ALink href="#" className="rating-reviews">
          ( {reviews?.length} reviews )
        </ALink>
      </div> } 

      <div
        className="product-short-desc"
        dangerouslySetInnerHTML={{ __html: product.subtitle }}
      />

      {product && product.variants.length > 0 ? (
        <>
          {product.variants[0]?.color ? (
            <div className="product-form product-variants product-color">
              <label>Color:</label>
              <div className="select-box">
                <select
                  name="color"
                  className="form-control select-color"
                  onChange={setColorHandler}
                  value={curColor}
                >
                  <option value="null">Choose an option</option>
                  {colors.map((item) =>
                    !isDisabled(item.title, curSize) ? (
                      <option value={item.title} key={"color-" + item.title}>
                        {item.title}
                      </option>
                    ) : (
                      ""
                    )
                  )}
                </select>
              </div>
            </div>
          ) : (
            ""
          )}

          {product.variants[0].size ? (
            <div className="product-form product-variants product-size mb-0 pb-2">
              <label>Size:</label>
              <div className="product-form-group">
                <div className="select-box">
                  <select
                    name="size"
                    className="form-control select-size"
                    onChange={setSizeHandler}
                    value={curSize}
                  >
                    <option value="null">Choose an option</option>
                    {sizes.map((item) =>
                      !isDisabled(curColor, item.title) ? (
                        <option value={item.title} key={"size-" + item.title}>
                          {item.title}
                        </option>
                      ) : (
                        ""
                      )
                    )}
                  </select>
                </div>

                <Collapse in={"null" !== curColor || "null" !== curSize}>
                  <div className="card-wrapper overflow-hidden reset-value-button w-100 mb-0">
                    <ALink
                      href="#"
                      className="product-variation-clean"
                      onClick={resetValueHandler}
                    >
                      Clean All
                    </ALink>
                  </div>
                </Collapse>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="product-variation-price">
            <Collapse in={cartActive && curIndex > -1}>
              <div className="card-wrapper">
                {curIndex > -1 ? (
                  <div className="single-product-price">
                    {product.variants[curIndex].prices[1]?.amount ? (
                      product.variants[curIndex].prices[0]?.amount ? (
                        <div className="product-price mb-0">
                          <ins className="new-price">
                            $
                            {toDecimal(
                              product.variants[curIndex].prices[0]?.amount
                            )}
                          </ins>
                          <del className="old-price">
                            $
                            {toDecimal(product.variants[curIndex].prices[1]?.amount)}
                          </del>
                        </div>
                      ) : (
                        <div className="product-price mb-0">
                          <ins className="new-price">
                            $
                            {toDecimal(product.variants[curIndex].prices[1]?.amount)}
                          </ins>
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Collapse>
          </div>
        </>
      ) : (
        ""
      )}

      <hr className="product-divider"></hr>

      {isStickyCart ? (
        <div className="sticky-content fix-top product-sticky-content">
          <div className="container">
            <div className="sticky-product-details">
              <figure className="product-image">
                <ALink href={"/product/default/" + product.id}>
                  <img
                    src={product.images[0].url}
                    width="90"
                    height="90"
                    alt="Product"
                  />
                </ALink>
              </figure>
              <div>
                <h4 className="product-title">
                  <ALink href={"/product/default/" + product.id}>
                    {product.title}
                  </ALink>
                </h4>
                <div className="product-info">
                  <div className="product-price mb-0">
                    {curIndex > -1 && product.variants[0] ? (
                      product.variants[curIndex].prices[1]?.amount ? (
                        product.variants[curIndex].prices[0]?.amount ? (
                          <>
                            <ins className="new-price">
                              $
                              {toDecimal(
                                product.variants[curIndex].prices[0]?.amount
                              )}
                            </ins>
                            <del className="old-price">
                              $
                              {toDecimal(
                                product.variants[curIndex].prices[0]?.amount
                              )}
                            </del>
                          </>
                        ) : (
                          <>
                            <ins className="new-price">
                              $
                              {toDecimal(
                                product.variants[curIndex].prices[1]?.amount
                              )}
                            </ins>
                          </>
                        )
                      ) : (
                        ""
                      )
                    ) : product.prices[1]?.amount !== product.prices[0]?.amount ? (
                      product.variants.length === 0 ? (
                        <>
                          <ins className="new-price">
                            ${toDecimal(product.variants.prices[1]?.amount)}
                          </ins>
                          <del className="old-price">
                            ${toDecimal(product.variants.prices[0]?.amount)}
                          </del>
                        </>
                      ) : (
                        <del className="new-price">
                          ${toDecimal(product.variants.prices[1]?.amount)} – $
                          {toDecimal(product.variants.prices[0]?.amount)}
                        </del>
                      )
                    ) : (
                      <ins className="new-price">
                        ${toDecimal(product.variants.prices[1]?.amount)}
                      </ins>
                    )}
                  </div>

                  <div className="ratings-container mb-0">
                    <div className="ratings-full">
                      <span
                        className="ratings"
                        style={{ width: 20 * product.ratings + "%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">
                        {toDecimal(product.rating_count)}
                      </span>
                    </div>

                    <ALink href="#" className="rating-reviews">
                      ( {product.reviews} reviews )
                    </ALink>
                  </div>
                </div>
              </div>
            </div>
            {console.log("product.variants[0].inventory_quantity}", product.variants[0].inventory_quantity)}
            <div className="product-form product-qty pb-0">
              <label className="d-none">QTY:</label>
              <div className="product-form-group">
                {console.log("product.variants[0].inventory_quantity}", product.variants[0].inventory_quantity)}
                <Quantity
                  max={product.variants[0].inventory_quantity}
                  product={product}
                  onChangeQty={changeQty}
                />
                <button
                  className={`btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${cartActive ? "" : "disabled"
                    }`}
                  onClick={addToCartHandler}
                >
                  <i className="d-icon-bag"></i>Add to Cart
                </button>
              </div>
              <button
              // className={`btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${cartActive ? "" : "disabled"
              //   }`}
              // onClick={addToCartHandler}
              >
                <i className="d-icon-bag"></i>Add to Cartttt
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="product-form product-qty pb-0">
            <label className="d-none">QTY:</label>
            <div className="product-form-group">
              <Quantity
                max={product.variants[0].inventory_quantity}
                product={product}
                onChangeQty={changeQty}
              />
              <button
                className={`btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${cartActive ? "" : "disabled"
                  }`}
                onClick={addToCartHandler}
              >
                <i className="d-icon-bag"></i>Add to Cart
              </button>
              
            </div>

          </div>
          <div className="product-form-group">
            <button
           className="btn-buy-now"
                disabled={!cartActive}
              onClick={handleBuyNow}
            >
             <i class="fas fa-shipping-fast"></i>Buy Now
            </button>
          </div>
          
        </div>

      )}

      <hr className="product-divider mb-3"></hr>

      <div className="product-footer">
        <div className="social-links mr-4">
          <ALink
            href="#"
            className="social-link social-facebook fab fa-facebook-f"
          ></ALink>
          <ALink
            href="#"
            className="social-link social-twitter fab fa-twitter"
          ></ALink>
          <ALink
            href="#"
            className="social-link social-pinterest fab fa-pinterest-p"
          ></ALink>
        </div>{" "}
        <span className="divider d-lg-show"></span>{" "}
        <a
          href="#"
          className={`btn-product btn-wishlist`}
          title={isWishlisted ? "Browse wishlist" : "Add to wishlist"}
          onClick={wishlistHandler}
        >
          <i
            className={isWishlisted ? "d-icon-heart-full" : "d-icon-heart"}
          ></i>{" "}
          {isWishlisted ? "Browse wishlist" : "Add to Wishlist"}
        </a>
      </div>
      <QuickviewModal openBuyNow = {openBuyNow} closeQuickview= {setOpenBuyNow} product= {product}/>

    </div>
  );
}

function mapStateToProps(state) {
  return {
    wishlist: state.wishlist.data ? state.wishlist.data : [],
  };
}

export default connect(mapStateToProps, {
  toggleWishlist: wishlistActions.toggleWishlist,
  addToCart: cartActions.addToCart,
})(DetailOne);
