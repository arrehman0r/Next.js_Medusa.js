import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import ALink from '~/components/features/custom-link';
import Countdown from '~/components/features/countdown';
import Quantity from '~/components/features/quantity';

import ProductNav from '~/components/partials/product/product-nav';
import DescTwo from '~/components/partials/product/desc/desc-two';

import { wishlistActions } from '~/store/wishlist';
import { cartActions } from '~/store/cart';

import { toDecimal } from '~/utils';

function DetailOne( props ) {
    let router = useRouter();
    const { data, isSticky = false, isDesc = false, adClass = '' } = props;
    const { toggleWishlist, addToCart, wishlist } = props;
    const [ curColor, setCurColor ] = useState( 'null' );
    const [ curSize, setCurSize ] = useState( 'null' );
    const [ curIndex, setCurIndex ] = useState( 0 );
    const [ cartActive, setCartActive ] = useState( false );
    const [ quantity, setQauntity ] = useState( 1 );
    let product = data && data.product;

    // decide if the product is wishlisted
    let isWishlisted, colors = [], sizes = [];
    isWishlisted = wishlist.findIndex( item => item.id === product.slug ) > -1 ? true : false;

    if ( product.data && product.variants.length > 0 ) {
        if ( product.variants[ 0 ].size )
            product.variants.forEach( item => {
                if ( sizes.findIndex( size => size.title === item.size.title ) === -1 ) {
                    sizes.push( { name: item.size.title, value: item.size.size } );
                }
            } );

        if ( product.variants[ 0 ].color ) {
            product.variants.forEach( item => {
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
        if ( product.variants.length > 0 ) {
            if ( ( curSize !== 'null' && curColor !== 'null' ) || ( curSize === 'null' && product.variants[ 0 ].size === null && curColor !== 'null' ) || ( curColor === 'null' && product.variants[ 0 ].color === null && curSize !== 'null' ) ) {
                setCartActive( true );
                setCurIndex( product.variants.findIndex( item => ( item.size !== null && item.color !== null && item.color.title === curColor && item.size.title === curSize ) || ( item.size === null && item.color.title === curColor ) || ( item.color === null && item.size.title === curSize ) ) );
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
        if ( product.stock > 0 && cartActive ) {
            if ( product.variants.length > 0 ) {
                let tmpName = product.title, tmpPrice;
                tmpName += curColor !== 'null' ? '-' + curColor : '';
                tmpName += curSize !== 'null' ? '-' + curSize : '';

                if ( product.variants[0]?.prices[1]?.amount === product.variants[0]?.prices[0]?.amount ) {
                    tmpPrice = product.variants[0]?.prices[1]?.amount;
                } else if ( !product.variants[ 0 ].price && product.discount > 0 ) {
                    tmpPrice = product.variants[0]?.prices[1]?.amount;
                } else {
                    tmpPrice = product.variants[ curIndex ].variants[0]?.prices[0]?.amount ? product.variants[ curIndex ].variants[0]?.prices[0]?.amount : product.variants[ curIndex ].price;
                }

                addToCart( { ...product.data, name: tmpName, qty: quantity, price: tmpPrice } );
            } else {
                addToCart( { ...product.data, qty: quantity, price: product.variants[0]?.prices[1]?.amount } );
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
            return product.variants.findIndex( item => item.color.title === curColor ) === -1;
        }

        if ( colors.length === 0 ) {
            return product.variants.findIndex( item => item.size.title === curSize ) === -1;
        }

        return product.variants.findIndex( item => item.color.title === color && item.size.title === size ) === -1;
    }

    function changeQty( qty ) {
        setQauntity( qty );
    }

    return (
        <div className={ `product-details ${ isSticky ? 'sticky' : '' } ${ adClass }` }>
            <div className="product-navigation">
                <ul className="breadcrumb breadcrumb-lg">
                    <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                    <li><ALink href="#" className="active">Products</ALink></li>
                    <li>Detail</li>
                </ul>

                <ProductNav product={ product } />
            </div>

            <h2 className="product-name">{ product.title }</h2>

            <div className='product-meta'>
                SKU: <span className='product-sku'>{ product.sku }</span>
                CATEGORIES: <span className='product-brand'>
                    {
                        product.categories.map( ( item, index ) =>
                            <React.Fragment key={ item.title + '-' + index }>
                                <ALink href={ { pathname: '/shop', query: { category: item.id } } }>
                                    { item.title }
                                </ALink>
                                { index < product.categories.length - 1 ? ', ' : '' }
                            </React.Fragment>
                        ) }
                </span>
            </div>

            <div className="product-price">
                {
                    product.variants[0]?.prices[1]?.amount !== product.variants[0]?.prices[0]?.amount ?
                        product.variants.length === 0 || ( product.variants.length > 0 && !product.variants[ 0 ].price ) ?
                            <>
                                <ins className="new-price">${ toDecimal( product.variants[0]?.prices[1]?.amount ) }</ins>
                                <del className="old-price">${ toDecimal( product.variants[0]?.prices[0]?.amount ) }</del>
                            </>
                            :
                            < del className="new-price">${ toDecimal( product.variants[0]?.prices[1]?.amount ) } – ${ toDecimal( product.variants[0]?.prices[0]?.amount ) }</del>
                        : <ins className="new-price">${ toDecimal( product.variants[0]?.prices[1]?.amount ) }</ins>
                }
            </div>

            {
                product.variants[0]?.prices[1]?.amount !== product.variants[0]?.prices[0]?.amount && product.variants.length === 0 ?
                    <Countdown type={ 2 } /> : ''
            }

            <div className="ratings-container">
                <div className="ratings-full">
                    <span className="ratings" style={ { width: 20 * product.ratings + '%' } }></span>
                    <span className="tooltiptext tooltip-top">{ toDecimal( product.ratings ) }</span>
                </div>

                <ALink href="#" className="rating-reviews">( { product.reviews } reviews )</ALink>
            </div>

            <p className="product-short-desc">{ product.short_description }</p>

            {
                product && product.variants.length > 0 ?
                    <>
                        {
                            product.variants[ 0 ].color ?
                                <div className='product-form product-color'>
                                    <label>Color:</label>

                                    <div className="product-variations">
                                        {
                                            colors.map( item =>
                                                <ALink href="#" className={ `color ${ curColor === item.title ? 'active' : '' } ${ isDisabled( item.title, curSize ) ? 'disabled' : '' }` } key={ "color-" + item.title } style={ { backgroundColor: `${ item.value }` } } onClick={ ( e ) => toggleColorHandler( item ) }></ALink> )
                                        }
                                    </div>
                                </div> : ''
                        }

                        {
                            product.variants[ 0 ].size ?
                                <div className='product-form product-size mb-0 pb-2'>
                                    <label>Size:</label>

                                    <div className="product-form-group">
                                        <div className="product-variations">
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
                                                    product.variants[ curIndex ].price ?
                                                        product.variants[ curIndex ].variants[0]?.prices[0]?.amount ?
                                                            <div className="product-price mb-0">
                                                                <ins className="new-price">${ toDecimal( product.variants[ curIndex ].variants[0]?.prices[0]?.amount ) }</ins>
                                                                <del className="old-price">${ toDecimal( product.variants[ curIndex ].price ) }</del>
                                                            </div>
                                                            : <div className="product-price mb-0">
                                                                <ins className="new-price">${ toDecimal( product.variants[ curIndex ].price ) }</ins>
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

            <div className="product-form product-qty pb-0">
                <label className="d-none">QTY:</label>
                <div className="product-form-group">
                    <Quantity max={ product.stock } product={ product } onChangeQty={ changeQty } />
                    <button className={ `btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${ cartActive ? '' : 'disabled' }` } onClick={ addToCartHandler } ><i className='d-icon-bag'></i>Add to Cart</button>
                </div>
            </div>

            <hr className="product-divider mb-3"></hr>

            <div className="product-footer">
                <div className="social-links mr-4">
                    <ALink href="#" className="social-link social-facebook fab fa-facebook-f"></ALink>
                    <ALink href="#" className="social-link social-twitter fab fa-twitter"></ALink>
                    <ALink href="#" className="social-link social-pinterest fab fa-pinterest-p"></ALink>
                </div> <span className="divider d-lg-show"></span> <a href="#" className={ `btn-product btn-wishlist` } title={ isWishlisted ? 'Browse wishlist' : 'Add to wishlist' } onClick={ wishlistHandler }>
                    <i className={ isWishlisted ? "d-icon-heart-full" : "d-icon-heart" }></i> {
                        isWishlisted ? 'Browse wishlist' : 'Add to Wishlist'
                    }
                </a>
            </div>

            {
                isDesc ? <DescTwo product={ product.data } adClass={ adClass } /> : ''
            }
        </div >
    )
}

function mapStateToProps( state ) {
    return {
        wishlist: state.wishlist.data ? state.wishlist.data : []
    }
}

export default connect( mapStateToProps, { toggleWishlist: wishlistActions.toggleWishlist, addToCart: cartActions.addToCart } )( DetailOne );