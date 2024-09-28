import { getShippingMethod, createCart, addLineItem, addShippingCharges, updateCart, createCheckOut, confirmOrder } from "~/server/axiosApi";
import { REGIOD_ID, SALES_CHANNEL_ID } from "~/env";
import { utilsActions } from "~/store/utils";
import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

export const fetchShippingMethod = async (dispatch) => {
  const region_id = REGIOD_ID;
  try {
    const res = await getShippingMethod(region_id);
    console.log("getShippingMethod res", res?.shipping_options);
    if (res?.shipping_options) {
      dispatch(utilsActions.setShippingMethod(res.shipping_options));
    }
  }
  catch (error) {
    console.log(error)
  }
};

export const handleCreateCartId = async (cartId, dispatch) => {
  console.log("handleCreateCartId called");
  if (cartId) return;
  const body = {
    region_id: REGIOD_ID,
    sales_channel_id: SALES_CHANNEL_ID,
    country_code: "pk",
    context: {},
  };
  try {
    const res = await createCart(body);
    const newCartId = res.cart?.id;
    console.log("newCartId", newCartId);
    dispatch({ type: "SET_CART_ID", payload: { cartId: newCartId } });
  } catch (error) {
    console.log("error creating cart id", error);
  }
};

export const triggerFacebookPixelEventAsync = (orderId, items, orderAmount) => {
  return new Promise((resolve, reject) => {
    console.log("Attempting to trigger Facebook Pixel event");
    console.log("window.fbq exists:", !!window.fbq);

    if (typeof window !== 'undefined' && window.fbq) {
      console.log("Inside fbq condition");
      console.log("Order ID:", orderId);
      console.log("Items:", items);
      console.log("Order Amount:", orderAmount);

      try {
        window.fbq('track', 'Purchase', {
          currency: 'PKR',
          value: orderAmount,
          content_type: 'order',
          content_ids: items.map(item => item.id),
          order_id: orderId
        });
        console.log("Facebook Pixel event triggered successfully");
        resolve();
      } catch (error) {
        console.error("Error triggering Facebook Pixel event:", error);
        reject(error);
      }
    } else {
      console.log("Unable to trigger Facebook Pixel event. fbq function not found.");
      resolve(); // Resolve anyway to not block the flow if fbq is not available
    }
  });
};

export const handleCreateOrder = async (e, dispatch, store, cartId, cartList, customerDetails, shippingMethod, user, router) => {
  dispatch(utilsActions.setLoading(true));

  console.log("handleCreateOrder called");
  e.preventDefault();
  const lineItems = cartList.map(item => ({
    variant_id: item.variants[0].id,
    quantity: item.qty,
  }));

  await Promise.all(lineItems.map(item => addLineItem(cartId, item)));
  const orderDetails = {
    email: user?.email || customerDetails.email || "info@partyshope.com",
    customer_id: user?.id || "",
    shipping_address: {
      address_1: customerDetails.address1,
      address_2: customerDetails?.address2 || "",
      country_code: "pk",
      first_name: customerDetails?.firstName,
      last_name: customerDetails?.lastName || "",
      phone: customerDetails?.phone,
      city: customerDetails?.city
    },
    billing_address: {
      address_1: customerDetails.address1,
      address_2: customerDetails?.address2 || "",
      country_code: "pk",
      first_name: customerDetails?.firstName,
      last_name: customerDetails?.lastName || "",
      phone: customerDetails?.phone,
      city: customerDetails?.city
    },
  };
  console.log("orderDetails", orderDetails);
  const addDeliveryChargesBody = { option_id: shippingMethod[0]?.id };
  console.log("shippingMethod[0]?.id", shippingMethod[0]?.id);
  try {
    await addShippingCharges(cartId, addDeliveryChargesBody);
    const res = await updateCart(cartId, orderDetails);
    console.log("res of upodate cart", res);
    await createCheckOut(cartId);
    const confirmOrderRes = await confirmOrder(cartId);
    console.log("confirmOrderRes", confirmOrderRes);
    if (confirmOrderRes.data?.id) {
      await triggerFacebookPixelEventAsync(confirmOrderRes?.data?.id, confirmOrderRes?.data?.items, confirmOrderRes?.data?.total);
      console.log("Order created successfully:", confirmOrderRes);
      store.dispatch({ type: "REFRESH_STORE", payload: { current: 1 } });
      dispatch(utilsActions.setLoading(false));
      router.push(`/order/${confirmOrderRes.data.id}`);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    dispatch(utilsActions.setLoading(false));
  }
};
