import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import ALink from '~/components/features/custom-link';
import Countdown from '~/components/features/countdown';
import Quantity from '~/components/features/quantity';

import { wishlistActions } from '~/store/wishlist';
import { cartActions } from '~/store/cart';

import { toDecimal } from '~/utils';


function DetailFour( props ) {
    let router = useRouter();
    const { data, isSticky = false, isDesc = false } = props;
    const { toggleWishlist, addToCart, wishlist } = props;
    const [ curColor, setCurColor ] = useState( 'null' );
    const [ curSize, setCurSize ] = useState( 'null' );
    const [ curIndex, setCurIndex ] = useState( 0 );
    const [ cartActive, setCartActive ] = useState( false );
    const [ quantity, setQauntity ] = useState( 1 );
    let product = data && data.product;

    // decide if the product is wishlisted
    let isWishlisted, colors = [], sizes = [];
    isWishlisted = wishlist.findIndex( item => item.id === product.data.slug ) > -1 ? true : false;

    if ( product.data && product.data.variants.length > 0 ) {
        if ( product.data.variants[ 0 ].size )
            product.data.variants.forEach( item => {
                if ( sizes.findIndex( size => size.title === item.size.title ) === -1 ) {
                    sizes.push( { name: item.size.title, value: item.size.size } );
                }
            } );

        if ( product.data.variants[ 0 ].color ) {
            product.data.variants.forEach( item => {
                if ( colors.findIndex( color => color.title === item.color.title ) === -1 )
                    colors.push( { name: item.color.title, value: item.color.color } );
            } );
        }
    }

    useEffect( () => {
        setCurIndex( -1 );
        resetValueHandler();
    }, [ product ] )

    useEffect( () => {
        if ( product.data.variants.length > 0 ) {
            if ( ( curSize !== 'null' && curColor !== 'null' ) || ( curSize === 'null' && product.data.variants[ 0 ].size === null && curColor !== 'null' ) || ( curColor === 'null' && product.data.variants[ 0 ].color === null && curSize !== 'null' ) ) {
                setCartActive( true );
                setCurIndex( product.data.variants.findIndex( item => ( item.size !== null && item.color !== null && item.color.title === curColor && item.size.title === curSize ) || ( item.size === null && item.color.title === curColor ) || ( item.color === null && item.size.title === curSize ) ) );
            } else {
                setCartActive( false );
            }
        } else {
            setCartActive( true );
        }

        if ( product.stock === 0 ) {
            setCartActive( false );
        }
    }, [ curColor, curSize, product ] )

    const wishlistHandler = ( e ) => {
        e.preventDefault();

        if ( toggleWishlist && !isWishlisted ) {
            let currentTarget = e.currentTarget;
            currentTarget.classList.add( 'load-more-overlay', 'loading' );
            toggleWishlist( product.data );

            setTimeout( () => {
                currentTarget.classList.remove( 'load-more-overlay', 'loading' );
            }, 1000 );
        } else {
            router.push( '/pages/wishlist' );
        }
    }

    const toggleColorHandler = ( color ) => {
        if ( !isDisabled( color.title, curSize ) ) {
            if ( curColor === color.title ) {
                setCurColor( 'null' );
            } else {
                setCurColor( color.title );
            }
        }
    }

    const toggleSizeHandler = ( size ) => {
        if ( !isDisabled( curColor, size.title ) ) {
            if ( curSize === size.title ) {
                setCurSize( 'null' );
            } else {
                setCurSize( size.title );
            }
        }
    }

    const addToCartHandler = () => {
        if ( product.data.stock > 0 && cartActive ) {
            if ( product.data.variants.length > 0 ) {
                let tmpName = product.data.title, tmpPrice;
                tmpName += curColor !== 'null' ? '-' + curColor : '';
                tmpName += curSize !== 'null' ? '-' + curSize : '';

                if ( product.data.variants[0]?.prices[1]?.amount === product.data.variants[0]?.prices[0]?.amount ) {
                    tmpPrice = product.data.variants[0]?.prices[1]?.amount;
                } else if ( !product.data.variants[ 0 ].price && product.data.discount > 0 ) {
                    tmpPrice = product.data.variants[0]?.prices[1]?.amount;
                } else {
                    tmpPrice = product.data.variants[ curIndex ].variants[0]?.prices[0]?.amount ? product.data.variants[ curIndex ].variants[0]?.prices[0]?.amount : product.data.variants[ curIndex ].price;
                }

                addToCart( { ...product.data, name: tmpName, qty: quantity, price: tmpPrice } );
            } else {
                addToCart( { ...product.data, qty: quantity, price: product.data.variants[0]?.prices[1]?.amount } );
            }
        }
    }

    const resetValueHandler = ( e ) => {
        setCurColor( 'null' );
        setCurSize( 'null' );
    }

    function isDisabled( color, size ) {
        if ( color === 'null' || size === 'null' ) return false;

        if ( sizes.length === 0 ) {
            return product.data.variants.findIndex( item => item.color.title === curColor ) === -1;
        }

        if ( colors.length === 0 ) {
            return product.data.variants.findIndex( item => item.size.title === curSize ) === -1;
        }

        return product.data.variants.findIndex( item => item.color.title === color && item.size.title === size ) === -1;
    }

    function changeQty( qty ) {
        setQauntity( qty );
    }

    return (
        <div className="product-details row pl-0">
            <div className="col-md-6">
                <h2 className="product-name mt-3">{ product.data.title }</h2>

                <div className='product-meta'>
                    SKU: <span className='product-sku'>{ product.data.sku }</span>
                    CATEGORIES: <span className='product-brand'>
                        {
                            product.data.categories.map( ( item, index ) =>
                                <React.Fragment key={ item.title + '-' + index }>
                                    <ALink href={ { pathname: '/shop', query: { category: item.id } } }>
                                        { item.title }
                                    </ALink>
                                    { index < product.data.categories.length - 1 ? ', ' : '' }
                                </React.Fragment>
                            ) }
                    </span>
                </div>

                <div className="ratings-container">
                    <div className="ratings-full">
                        <span className="ratings" style={ { width: 20 * product.data.ratings + '%' } }></span>
                        <span className="tooltiptext tooltip-top">{ toDecimal( product.data.ratings ) }</span>
                    </div>

                    <ALink href="#" className="rating-reviews">( { product.data.reviews } reviews )</ALink>
                </div>

                <p className="product-short-desc">{ product.data.short_description }</p>

                <ul className="product-status mt-4 mb-4 list-type-check list-style-none pl-0">
                    <li>Praesent id enim sit amet.</li>
                    <li>Tdio vulputate eleifend in in tortor. ellus massa.Dristique sitiismonec.</li>
                    <li>Massa ristique sit amet condim vel, facilisis quimequistiqutiqu amet condim.</li>
                </ul>
            </div>

            <div className="col-md-6 pl-2">
                <div className="product-price">
                    {
                        product.data.variants[0]?.prices[1]?.amount !== product.data.variants[0]?.prices[0]?.amount ?
                            product.data.variants.length === 0 || ( product.data.variants.length > 0 && !product.data.variants[ 0 ].price ) ?
                                <>
                                    <ins className="new-price">${ toDecimal( product.data.variants[0]?.prices[1]?.amount ) }</ins>
                                    <del className="old-price">${ toDecimal( product.data.variants[0]?.prices[0]?.amount ) }</del>
                                </>
                                :
                                < del className="new-price">${ toDecimal( product.data.variants[0]?.prices[1]?.amount ) } – ${ toDecimal( product.data.variants[0]?.prices[0]?.amount ) }</del>
                            : <ins className="new-price">${ toDecimal( product.data.variants[0]?.prices[1]?.amount ) }</ins>
                    }
                </div>

                {
                    product.data.variants[0]?.prices[1]?.amount !== product.data.variants[0]?.prices[0]?.amount && product.data.variants.length === 0 ?
                        <Countdown type={ 2 } /> : ''
                }

                {
                    product && product.data.variants.length > 0 ?
                        <>
                            {
                                product.data.variants[ 0 ].color ?
                                    <div className='product-form product-color'>
                                        <label>Color:</label>

                                        <div className="product-variants">
                                            {
                                                colors.map( item =>
                                                    <ALink href="#" className={ `color ${ curColor === item.title ? 'active' : '' } ${ isDisabled( item.title, curSize ) ? 'disabled' : '' }` } key={ "color-" + item.title } style={ { backgroundColor: `${ item.value }` } } onClick={ ( e ) => toggleColorHandler( item ) }></ALink> )
                                            }
                                        </div>
                                    </div> : ''
                            }

                            {
                                product.data.variants[ 0 ].size ?
                                    <div className='product-form product-size'>
                                        <label>Size:</label>

                                        <div className="product-form-group">
                                            <div className="product-variants">
                                                {
                                                    sizes.map( item =>
                                                        <ALink href="#" className={ `size ${ curSize === item.title ? 'active' : '' } ${ isDisabled( curColor, item.title ) ? 'disabled' : '' }` } key={ "size-" + item.title } onClick={ ( e ) => toggleSizeHandler( item ) }>{ item.value }</ALink> )
                                                }
                                            </div>

                                            <Collapse in={ 'null' !== curColor || 'null' !== curSize }>
                                                <div className="card-wrapper overflow-hidden reset-value-button w-100 mb-0">
                                                    <ALink href='#' className='product-variation-clean' onClick={ resetValueHandler }>Clean All</ALink>
                                                </div>
                                            </Collapse>
                                        </div>
                                    </div> : ''
                            }

                            <div className='product-variation-price'>
                                <Collapse in={ cartActive && curIndex > -1 }>
                                    <div className="card-wrapper">
                                        {
                                            curIndex > -1 ?
                                                <div className="single-product-price">
                                                    {
                                                        product.data.variants[ curIndex ].price ?
                                                            product.data.variants[ curIndex ].variants[0]?.prices[0]?.amount ?
                                                                <div className="product-price mb-0">
                                                                    <ins className="new-price">${ toDecimal( product.data.variants[ curIndex ].variants[0]?.prices[0]?.amount ) }</ins>
                                                                    <del className="old-price">${ toDecimal( product.data.variants[ curIndex ].price ) }</del>
                                                                </div>
                                                                : <div className="product-price mb-0">
                                                                    <ins className="new-price">${ toDecimal( product.data.variants[ curIndex ].price ) }</ins>
                                                                </div>
                                                            : ""
                                                    }
                                                </div> : ''
                                        }
                                    </div>
                                </Collapse>
                            </div>

                        </>
                        : ''
                }

                <hr className="product-divider"></hr>

                <div className="product-form product-qty">
                    <label className="d-none">QTY:</label>
                    <div className="product-form-group mr-2">
                        <Quantity max={ product.data.stock } product={ product } onChangeQty={ changeQty } />
                        <button className={ `btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${ cartActive ? '' : 'disabled' }` } onClick={ addToCartHandler } onClick={ addToCartHandler }><i className='d-icon-bag'></i>Add to Cart</button>
                    </div>
                </div>

                <hr className="product-divider mb-3"></hr>

                <div className="product-footer">
                    <div className="social-links mr-4">
                        <ALink href="#" className="social-link social-facebook fab fa-facebook-f"></ALink>
                        <ALink href="#" className="social-link social-twitter fab fa-twitter"></ALink>
                        <ALink href="#" className="social-link social-pinterest fab fa-pinterest-p"></ALink>
                    </div>

                    <div className="product-action">
                        <a href="#" className={ `btn-product btn-wishlist mr-6` } title={ isWishlisted ? 'Browse wishlist' : 'Add to wishlist' } onClick={ wishlistHandler }>
                            <i className={ isWishlisted ? "d-icon-heart-full" : "d-icon-heart" }></i> {
                                isWishlisted ? 'Browse wishlist' : 'Add to Wishlist'
                            }
                        </a>

                        {/* <ALink href="#" className="btn-product btn-compare"><i className="d-icon-compare"></i>Add to compare</ALink> */ }
                    </div>
                </div>
            </div >
        </div >
    )
}

function mapStateToProps( state ) {
    return {
        wishlist: state.wishlist.data ? state.wishlist.data : []
    }
}

export default connect( mapStateToProps, { toggleWishlist: wishlistActions.toggleWishlist, addToCart: cartActions.addToCart } )( DetailFour );