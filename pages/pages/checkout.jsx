import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { connect, useDispatch, useSelector, useStore } from "react-redux";
import Helmet from "react-helmet";
import ALink from "~/components/features/custom-link";
import { useRouter } from 'next/navigation';
import { fetchShippingMethod, handleCreateCartId, handleCreateOrder } from "~/utils/checkoutFunctions";
import CheckoutForm from "~/components/partials/checkout/checkout-form";

function Checkout(props) {
  const { cartList } = props;
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const cartId = useSelector((state) => state.cart.cartId);
  const shippingMethod = useSelector((state) => state.utils.shippingMethod);
  const loading = useSelector((state) => state.utils.loading);
  const user = useSelector((state) => state.user.user);

  const customerDetailsRef = useRef({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });

  console.log("user from checkout", user?.id);

  useEffect(() => {
    if (!shippingMethod || shippingMethod.length === 0) {
      fetchShippingMethod(dispatch);
    }
  }, [shippingMethod, dispatch]);

  useEffect(() => {
    if (!cartId) handleCreateCartId(cartId, dispatch);
  }, [cartId, dispatch]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    customerDetailsRef.current[name] = value;
  }, []);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    handleCreateOrder(e, dispatch, store, cartId, cartList, customerDetailsRef.current, shippingMethod, user);
  }, [dispatch, store, cartId, cartList, shippingMethod, user]);

  const memoizedCheckoutForm = useMemo(() => (
    <CheckoutForm 
      handleFormSubmit={handleFormSubmit} 
      handleInputChange={handleInputChange} 
      cartList={cartList}  
      shippingMethod={shippingMethod} 
      loading={loading}
    />
  ), [handleFormSubmit, handleInputChange, cartList, shippingMethod, loading]);

  return (
    <main className="main checkout">
      <Helmet>
        <title>Party Shope Web Store | Checkout</title>
      </Helmet>

      <h1 className="d-none">Party Shope Web Store - Checkout</h1>

      <div
        className={`page-content pt-7 pb-10 ${cartList.length > 0 ? "mb-10" : "mb-2"}`}
      >
        <div className="step-by pr-4 pl-4">
          <h3 className="title title-simple title-step">
            <ALink href="/pages/cart">1. Shopping Cart</ALink>
          </h3>
          <h3 className="title title-simple title-step active">
            <ALink href="">2. Checkout</ALink>
          </h3>
          <h3 className="title title-simple title-step">
            <ALink href="/pages/order">3. Order Complete</ALink>
          </h3>
        </div>
        <div className="container mt-7">
          {cartList.length > 0 ? (
            memoizedCheckoutForm
          ) : (
            <div className="empty-cart text-center">
              <p>Your cart is currently empty.</p>
              <i className="cart-empty d-icon-bag"></i>
              <p className="return-to-shop mb-0">
                <ALink
                  className="button wc-backward btn btn-dark btn-md"
                  href="/shop"
                >
                  Return to shop
                </ALink>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function mapStateToProps(state) {
  return {
    cartList: state.cart.data ? state.cart.data : [],
  };
}

export default React.memo(connect(mapStateToProps)(Checkout));