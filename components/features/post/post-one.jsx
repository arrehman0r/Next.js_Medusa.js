import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';
import OwlCarousel from '~/components/features/owl-carousel';

import { videoHandler } from '~/utils';
import { mainSlider20 } from '~/utils/data/carousel';

function PostOne ( props ) {
    const { post, adClass = 'mb-7', isLazy = false, isOriginal = false, btnText = "Read more", btnAdClass = '', isButton = true } = props;

    return (
        <div className={ `post post-classic ${ post.type === 'video' ? 'post-video' : '' } ${ adClass }` }>
            {
                post.type === 'image' || post.type === 'video' ?
                    <figure className={ `post-media ${ post.type === 'image' ? 'overlay-zoom' : '' }` }>
                        {
                            isLazy ?
                                <ALink href={ `/blog/single/${ post.slug }` }>
                                    {
                                        isOriginal ? <LazyLoadImage
                                            src={   post.large_picture[ 0 ].url }
                                            alt="post image"
                                            width={ 100 }
                                            height={ post.large_picture[ 0 ].height }
                                            effect="opacity; transform"
                                            style={ { backgroundColor: "#DEE6E8" } }
                                        />
                                            :
                                            <LazyLoadImage
                                                src={   post.picture[ 0 ].url }
                                                alt="post image"
                                                width={ post.picture[ 0 ].width }
                                                height={ post.picture[ 0 ].height }
                                                effect="opacity; transform"
                                                style={ { backgroundColor: "#DEE6E8" } }
                                            />
                                    }
                                </ALink>
                                :
                                <ALink href={ `/blog/single/${ post.slug }` }>
                                    {
                                        isOriginal ? <img
                                            src={   post.large_picture[ 0 ].url }
                                            alt="post image"
                                            width={ 100 }
                                            height={ post.large_picture[ 0 ].height }
                                        /> :

                                            <img
                                                src={   post.picture[ 0 ].url }
                                                alt="post image"
                                                width={ post.picture[ 0 ].width }
                                                height={ post.picture[ 0 ].height }
                                            />
                                    }
                                </ALink>
                        }
                        {
                            post.type === 'video' ?
                                <>
                                    <span className="video-play" onClick={ videoHandler }></span>
                                    <video width="380">
                                        <source src={   post.video.url } type="video/mp4" />
                                    </video>
                                </>
                                : ''
                        }
                    </figure> :
                    <figure className="post-media">
                        {
                            isLazy ?
                                <OwlCarousel adClass="owl-theme owl-dot-inner owl-dot-white gutter-no" options={ mainSlider20 }>
                                    {
                                        post.picture.map( ( item, index ) =>
                                            <LazyLoadImage
                                                src={   item.url }
                                                alt="post gallery"
                                                key={ item.title + '-' + index }
                                                width={ item.width }
                                                height={ item.height }
                                                effect="opacity; transform"
                                                style={ { backgroundColor: "#DEE6E8" } }
                                            />
                                        ) }
                                </OwlCarousel>
                                :
                                <OwlCarousel adClass="owl-theme owl-dot-inner owl-dot-white gutter-no" options={ mainSlider20 }>
                                    {
                                        post.picture.map( ( item, index ) =>
                                            <img
                                                src={   item.url }
                                                alt="post gallery"
                                                key={ item.title + '-' + index }
                                                width={ item.width }
                                                height={ item.height }
                                            />
                                        ) }
                                </OwlCarousel>
                        }
                    </figure>
            }

            <div className="post-details">
                <div className="post-meta">
                    by <ALink href="#" className="post-author">{ post.author }</ALink> on <ALink href="#" className="post-date">{ new Date( post.date ).toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: "2-digit", timeZone: "UTC" } ) }</ALink> | <ALink href="#" className="post-comment"><span>{ post.comments }</span> Comments</ALink>
                </div>
                <h4 className="post-title">
                    <ALink href={ `/blog/single/${ post.slug }` }>{ post.title }</ALink>
                </h4>
                <p className="post-content">{ post.content }</p>
                {
                    isButton ?
                        <ALink href={ `/blog/single/${ post.slug }` } className={ `btn btn-link btn-underline btn-primary ${ btnAdClass }` }>{ btnText }<i className="d-icon-arrow-right"></i></ALink>
                        : ''
                }
            </div>
        </div >
    )
}

export default PostOne;