import React from "react";
import { getTotalPrice, toDecimal } from "~/utils";


const CheckoutForm = React.memo(({ handleFormSubmit, handleInputChange, cartList, shippingMethod, loading }) => {
    return (
        <form className="form" onSubmit={handleFormSubmit}>
            <div className="row">
                <div className="col-lg-7 mb-6 mb-lg-0 pr-lg-4">
                    <h3 className="title title-simple text-left text-uppercase">
                        Billing Details
                    </h3>
                    <div className="row">
                        <div className="col-xs-6">
                            <label>First Name *</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                className="form-control"
                                name="firstName"
                                required
                            />
                        </div>
                        <div className="col-xs-6">
                            <label>Last Name *</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                className="form-control"
                                name="lastName"
                                required
                            />
                        </div>
                    </div>
                   
                    <label>Street Address *</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        name="address1"
                        required
                        placeholder="House number and street name"
                    />
                    <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        name="address2"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                    <div className="row">
                        <div className="col-xs-6">
                            <label>Town / City *</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                className="form-control"
                                name="city"
                                required
                            />
                        </div>
                        <div className="col-xs-6">
                            <label>State *</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                className="form-control"
                                name="state"
                                required
                            />
                        </div>
                    </div>
                    <div className="row"> </div>
                  
                    <label>Phone *</label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        name="phone"
                        required
                    />
                    {/* </div> */}

                    <label>Email Address</label>
                    <input
                        onChange={handleInputChange}
                        type="email"
                        className="form-control"
                        name="email"
                    />

                
                    <h2 className="title title-simple text-uppercase text-left mt-6">
                        Additional Information
                    </h2>
                    <label>Order Notes (Optional)</label>
                    <textarea
                        className="form-control pb-2 pt-2 mb-0"
                        cols="30"
                        rows="5"
                        placeholder="Notes about your order, e.g. special notes for delivery"
                    ></textarea>
                </div>

                <aside className="col-lg-5 sticky-sidebar-wrapper">
                    <div
                        className="sticky-sidebar mt-1"
                        data-sticky-options="{'bottom': 50}"
                    >
                        <div className="summary pt-5">
                            <h3 className="title title-simple text-left text-uppercase">
                                Your Order
                            </h3>
                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartList.map((item) => (
                                        <tr key={item.title}>
                                            <td className="product-name">
                                                {item.title}{" "}
                                                <span className="product-quantity">
                                                    ×&nbsp;{item.qty}
                                                </span>
                                            </td>
                                            <td className="product-total text-body">
                                                Rs.{toDecimal(item.sale_price * item.qty)}
                                            </td>
                                        </tr>
                                    ))}

                                    <tr className="summary-subtotal">
                                        <td>
                                            <h4 className="summary-subtitle">Subtotal</h4>
                                        </td>
                                        <td className="summary-subtotal-price pb-0 pt-0">
                                            Rs.{toDecimal(getTotalPrice(cartList))}
                                        </td>
                                    </tr>
                                    <tr className="sumnary-shipping shipping-row-last">

                                        {shippingMethod && shippingMethod[0] && getTotalPrice(cartList) <= shippingMethod[0]?.requirements[0]?.amount ?
                                            (<>  <td>
                                                <h4 className="summary-subtitle">
                                                    Flat Shipping
                                                </h4>
                                            </td>

                                                <td>{`Rs.${shippingMethod[0].amount}`}</td></>) : (<>  <td>
                                                    <h4 className="summary-subtitle">
                                                        Free Shipping
                                                    </h4>
                                                </td>

                                                    <td>Rs.00</td></>)}

                                    
                                    </tr>
                                    <tr className="summary-total">
                                        <td className="pb-0">
                                            <h4 className="summary-subtitle">Total</h4>
                                        </td>
                                        <td className=" pt-0 pb-0">
                                            <p className="summary-total-price ls-s text-primary">
                                                Rs.{toDecimal(getTotalPrice(cartList) + (shippingMethod && shippingMethod[0] && getTotalPrice(cartList) <= shippingMethod[0]?.requirements[0]?.amount ? shippingMethod[0].amount : 0))}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="payment accordion radio-type">
                                <h4 className="summary-subtitle ls-m pb-3">
                                    Payment Methods
                                </h4>

                                <div className="checkbox-group">
                                  
                                    <div className="custom-radio">
                                        <input
                                            type="radio"
                                            id="local_pickup"
                                            defaultChecked
                                            name="shipping"
                                            className="custom-control-input"
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="local_pickup"
                                        >
                                            Cash on Delivery
                                        </label>

                                        {/* <ALink href="#" className={ `text-body text-normal ls-m ${ !isFirst ? 'collapse' : '' }` } onClick={ () => { isFirst && setFirst( !isFirst ) } }>Cash on delivery</ALink> */}
                                    </div>

                                 
                                </div>
                            </div>
                            <div className="form-checkbox mt-4 mb-5">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    id="terms-condition"
                                    name="terms-condition"
                                />
                                <label
                                    className="form-control-label"
                                    htmlFor="terms-condition"
                                >
                                    I have read and agree to the terms
                                    {/* <ALink href="#">terms and conditions </ALink>* */}
                                </label>
                            </div>
                            <button
                                type="submit"
                                className={` ${loading ? "btn btn-dark btn-rounded disabled-btn-order" : "btn btn-dark btn-rounded btn-order"}`}
                                // onClick={() => handleCreateOrder()}
                                disabled={loading}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
     );
    });
    
    export default CheckoutForm;