import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import ALink from '~/components/features/custom-link';

import { toDecimal } from '~/utils';
export default function DescThree( props ) {
    const { product, isGuide = false } = props;

    let colors = [], sizes = [];

    if ( product.variants.length > 0 ) {
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

    const setRating = ( e ) => {
        e.preventDefault();

        if ( e.currentTarget.parentNode.querySelector( '.active' ) ) {
            e.currentTarget.parentNode.querySelector( '.active' ).classList.remove( 'active' );
        }

        e.currentTarget.classList.add( 'active' );
    }

    return (
        <Tabs className="tab tab-nav-simple product-tabs mb-4" selectedTabClassName="show" selectedTabPanelClassName="active" defaultIndex={ 0 } >
            <TabList className="nav nav-tabs justify-content-center" role="tablist">
                <Tab className="nav-item">
                    <span className="nav-link">Description</span>
                </Tab>
                <Tab className="nav-item">
                    <span className="nav-link">Additional information</span>
                </Tab>
                {
                    isGuide ?
                        <Tab className="nav-item">
                            <span className="nav-link">Size Guide</span>
                        </Tab> : ''
                }
                <Tab className="nav-item">
                    <span className="nav-link">Reviews ({ product.reviews })</span>
                </Tab>
            </TabList>

            <div className="tab-content">
                <TabPanel className="tab-pane product-tab-description">
                    <div className="row">
                        <div className="col-12 mb-8">
                            <p className="mb-6">
                                Praesent id enim sit amet.Tdio vulputate eleifend in in tortor. ellus massa. siti iMassa ristique sit amet condim vel, facilisis quimequistiqutiqu amet condim Dilisis Facilisis quis sapien. Praesent id enim sit amet.</p>
                            <ul className="mb-6">
                                <li>Praesent id enim sit amet.Tdio vulputate</li>
                                <li>Eleifend in in tortor. ellus massa.Dristique sitii</li>
                                <li>Massa ristique sit amet condim vel</li>
                                <li>Dilisis Facilisis quis sapien. Praesent id enim sit amet</li>
                            </ul>
                            <p className="mb-0">Praesent id enim sit amet odio vulputate eleifend in in tortor. Sellus massa, tristique sitiismonec tellus massa, tristique sit amet condim vel, facilisis quimequistiqutiqu amet condim vel, facilisis Facilisis quis sapien. Praesent id enim sit amet odio vulputate odio vulputate eleifend in in tortor. Sellus massa, tristique sitiismonec tellus massa, tristique sit ametcdimel,facilisis quimequistiqutiqu amet condim vel, facilisis Facilisis sit amet odio vulputate</p>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel className="tab-pane product-tab-additional">
                    <ul className="list-none">
                        {
                            product.categories.length > 0 ?
                                <li><label>Categories:</label>
                                    <p>
                                        { product.categories.map( ( item, index ) => (
                                            <React.Fragment key={ item.title + '-' + index }>
                                                { item.title }
                                                { index < product.categories.length - 1 ? ', ' : "" }
                                            </React.Fragment>
                                        ) ) }
                                    </p>
                                </li> : ""
                        }

                        {
                            product && product.brands.length > 0 ?
                                <li><label>Brands:</label>
                                    <p>
                                        { product.brands.map( ( item, index ) => (
                                            <React.Fragment key={ item.title + '-' + index }>
                                                { item.title }
                                                { index < product.brands.length - 1 ? ', ' : "" }
                                            </React.Fragment>
                                        ) ) }
                                    </p>
                                </li> : ""
                        }

                        {
                            colors.length > 0 ?
                                <li><label>Color:</label>
                                    <p>
                                        { colors.map( ( item, index ) => (
                                            <React.Fragment key={ item.title + '-' + index }>
                                                { item.title }
                                                { index < colors.length - 1 ? ', ' : "" }
                                            </React.Fragment>
                                        ) ) }
                                    </p>
                                </li> : ""
                        }

                        {
                            sizes.length > 0 ?
                                <li><label>Size:</label>
                                    <p>
                                        {
                                            sizes.map( ( item, index ) => (
                                                <React.Fragment key={ item.title + '-' + index }>
                                                    { item.title }
                                                    { index < sizes.length - 1 ? ', ' : "" }
                                                </React.Fragment>
                                            ) ) }
                                    </p>
                                </li> : ""
                        }
                    </ul>
                </TabPanel>

                {
                    isGuide ?
                        <TabPanel className="tab-pane product-tab-size-guide">
                            <figure className="size-image mt-4 mb-4">
                                <img src="./images/size_guide.png" alt="Size Guide Image" width="217"
                                    height="398" />
                            </figure>
                            <figure className="size-table mt-4 mb-4">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SIZE</th>
                                            <th>CHEST(IN.)</th>
                                            <th>WEIST(IN.)</th>
                                            <th>HIPS(IN.)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>XS</th>
                                            <td>34-36</td>
                                            <td>27-29</td>
                                            <td>34.5-36.5</td>
                                        </tr>
                                        <tr>
                                            <th>S</th>
                                            <td>36-38</td>
                                            <td>29-31</td>
                                            <td>36.5-38.5</td>
                                        </tr>
                                        <tr>
                                            <th>M</th>
                                            <td>38-40</td>
                                            <td>31-33</td>
                                            <td>38.5-40.5</td>
                                        </tr>
                                        <tr>
                                            <th>L</th>
                                            <td>40-42</td>
                                            <td>33-36</td>
                                            <td>40.5-43.5</td>
                                        </tr>
                                        <tr>
                                            <th>XL</th>
                                            <td>42-45</td>
                                            <td>36-40</td>
                                            <td>43.5-47.5</td>
                                        </tr>
                                        <tr>
                                            <th>XXL</th>
                                            <td>45-48</td>
                                            <td>40-44</td>
                                            <td>47.5-51.5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </figure>
                        </TabPanel> : ''
                }

                <TabPanel className="tab-pane product-tab-reviews">
                    {
                        product.reviews === 0 ?
                            <div className="comments mb-2 pt-2 pb-2 border-no">
                                There are no reviews yet.
                            </div> :
                            <div className="comments mb-8 pt-2 pb-2 border-no">
                                <ul>
                                    <li>
                                        <div className="comment">
                                            <figure className="comment-media">
                                                <ALink href="#">
                                                    <img src="./images/blog/comments/1.jpg" alt="avatar" width="100" height="100" />
                                                </ALink>
                                            </figure>
                                            <div className="comment-body">
                                                <div className="comment-rating ratings-container mb-0">
                                                    <div className="ratings-full">
                                                        <span className="ratings" style={ { width: product.ratings * 20 + '%' } }></span>
                                                        <span className="tooltiptext tooltip-top">{ toDecimal( product.ratings ) }</span>
                                                    </div>
                                                </div>
                                                <div className="comment-user">
                                                    <span className="comment-date text-body">September 22, 2020 at 9:42
															pm</span>
                                                    <h4><ALink href="#">John Doe</ALink></h4>
                                                </div>

                                                <div className="comment-content">
                                                    <p>Sed pretium, ligula sollicitudin laoreet viverra, tortor
                                                    libero sodales leo,
                                                    eget blandit nunc tortor eu nibh. Nullam mollis. Ut justo.
                                                    Suspendisse potenti.
                                                    Sed egestas, ante et vulputate volutpat, eros pede semper
															est, vitae luctus metus libero eu augue.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {
                                        product.reviews > 1 ?
                                            <li>
                                                <div className="comment">
                                                    <figure className="comment-media">
                                                        <ALink href="#">
                                                            <img src="./images/blog/comments/2.jpg" alt="avatar" width="100" height="100" />
                                                        </ALink>
                                                    </figure>

                                                    <div className="comment-body">
                                                        <div className="comment-rating ratings-container mb-0">
                                                            <div className="ratings-full">
                                                                <span className="ratings" style={ { width: product.ratings * 20 + '%' } }></span>
                                                                <span className="tooltiptext tooltip-top">{ toDecimal( product.ratings ) }</span>
                                                            </div>
                                                        </div>
                                                        <div className="comment-user">
                                                            <span className="comment-date text-body">September 22, 2020 at 9:42
															pm</span>
                                                            <h4><ALink href="#">John Doe</ALink></h4>
                                                        </div>

                                                        <div className="comment-content">
                                                            <p>Sed pretium, ligula sollicitudin laoreet viverra, tortor
                                                            libero sodales leo, eget blandit nunc tortor eu nibh. Nullam
                                                            mollis.
                                                            Ut justo. Suspendisse potenti. Sed egestas, ante et
                                                            vulputate volutpat,
                                                            eros pede semper est, vitae luctus metus libero eu augue.
                                                            Morbi purus libero,
                                                            faucibus adipiscing, commodo quis, avida id, est. Sed
                                                            lectus. Praesent elementum
                                                            hendrerit tortor. Sed semper lorem at felis. Vestibulum
															volutpat.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            : ""
                                    }
                                </ul>
                            </div>
                    }

                    <div className="reply">
                        <div className="title-wrapper text-left">
                            <h3 className="title title-simple text-left text-normal">
                                {
                                    product.reviews > 0 ? "Add a Review" :
                                        "Be The First To Review “" + product.title + "”"
                                }
                            </h3>
                            <p>Your email address will not be published. Required fields are marked *</p>
                        </div>
                        <div className="rating-form">
                            <label htmlFor="rating" className="text-dark">Your rating * </label>
                            <span className="rating-stars selected">
                                { [ 1, 2, 3, 4, 5 ].map( ( num, index ) =>
                                    <a className={ `star-${ num }` } href="#" onClick={ setRating } key={ 'star-' + index }>{ num }</a>
                                ) }
                            </span>

                            <select name="rating" id="rating" required="" style={ { display: 'none' } }>
                                <option value="">Rate…</option>
                                <option value="5">Perfect</option>
                                <option value="4">Good</option>
                                <option value="3">Average</option>
                                <option value="2">Not that bad</option>
                                <option value="1">Very poor</option>
                            </select>
                        </div>
                        <form action="#">
                            <textarea id="reply-message" cols="30" rows="6" className="form-control mb-4"
                                placeholder="Comment *" required></textarea>
                            <div className="row">
                                <div className="col-md-6 mb-5">
                                    <input type="text" className="form-control" id="reply-name"
                                        name="reply-name" placeholder="Name *" required />
                                </div>
                                <div className="col-md-6 mb-5">
                                    <input type="email" className="form-control" id="reply-email"
                                        name="reply-email" placeholder="Email *" required />
                                </div>
                            </div>
                            <div className="form-checkbox mb-4">
                                <input type="checkbox" className="custom-checkbox" id="signin-remember"
                                    name="signin-remember" />
                                <label className="form-control-label" htmlFor="signin-remember">
                                    Save my name, email, and website in this browser for the next time I
                                    comment.
											</label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-rounded">Submit<i
                                className="d-icon-arrow-right"></i></button>
                        </form>
                    </div>

                </TabPanel>
            </div>
        </Tabs >
    )
}