import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';

import { toDecimal } from '~/utils';

function SmallProduct( props ) {
    const { product, adClass, isReviewCount = true } = props;

    return (
        <div className={ `product product-list-sm ${ adClass }` }>
            <figure className="product-media">
                <ALink href={ `/product/default/${ product.id }` }>
                    <LazyLoadImage
                        alt="product"
                        src={    product.images[ 0 ].url }
                        threshold={ 500 }
                        effect="opacity"
                        width="300"
                        height="338"
                    />

                    {
                        product.images.length >= 2 ?
                            <LazyLoadImage
                                alt="product"
                                src={   product.images[ 1 ].url }
                                threshold={ 500 }
                                width="300"
                                height="338"
                                effect="opacity"
                                wrapperClassName="product-image-hover"
                            />
                            : ""
                    }
                </ALink>
            </figure>

            <div className="product-details">
                <h3 className="product-name">
                    <ALink href={ `/product/default/${ product.id }` }>{ product.title }</ALink>
                </h3>

                <div className="product-price">
                    {
                        product.variants[0]?.prices[1]?.amount !== product.variants[0]?.prices[0]?.amount ?
                            product.variants.length === 0 || ( product.variants.length > 0 && !product.variants[ 0 ].price ) ?
                                <>
                                    <ins className="new-price">Rs.{ toDecimal( product.variants[0]?.prices[1]?.amount ) }</ins>
                                    <del className="old-price">Rs.{ toDecimal( product.variants[0]?.prices[0]?.amount ) }</del>
                                </>
                                :
                                < del className="new-price">Rs.{ toDecimal( product.variants[0]?.prices[1]?.amount ) } – Rs.{ toDecimal( product.variants[0]?.prices[0]?.amount ) }</del>
                            : <ins className="new-price">Rs.{ toDecimal( product.variants[0]?.prices[1]?.amount ) }</ins>
                    }
                </div>

                <div className="ratings-container">
                    <div className="ratings-full">
                        <span className="ratings" style={ { width: 20 * product.ratings + '%' } }></span>
                        <span className="tooltiptext tooltip-top">{ toDecimal( product.ratings ) }</span>
                    </div>

                    {
                        isReviewCount ?
                            <ALink href={ `/product/default/${ product.id }` } className="rating-reviews">( { product.reviews } reviews )</ALink> : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default React.memo( SmallProduct );