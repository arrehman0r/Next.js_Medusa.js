import React, { useState } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import ALink from "~/components/features/custom-link";
import ImageModal from "~/components/features/modals/image-modal";
import PostReview from "~/components/features/post-review";
import { modalActions } from "~/store/modal";
import { formatDate, toDecimal } from "~/utils";

function DescOne(props) {
  const { product, reviews, isGuide = true, isDivider = true, openModal } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  let colors = [],
    sizes = [];

  if (product.variants.length > 0) {
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


  const showVideoModalHandler = (e) => {
    e.preventDefault();
    let link = e.currentTarget.closest(".btn-play").getAttribute("data");
    openModal(link);
  };

  const showImageModalHandler = (images) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
  };
  return (
    <div>
    <Tabs
      className="tab tab-nav-simple product-tabs"
      selectedTabClassName="show"
      selectedTabPanelClassName="active"
      defaultIndex={0}
    >
      <TabList className="nav nav-tabs justify-content-center" role="tablist">
        <Tab className="nav-item">
          <span className="nav-link">Description</span>
        </Tab>


        <Tab className="nav-item">
          <span className="nav-link">Reviews ({reviews.length})</span>
        </Tab>
      </TabList>

      <div className="tab-content">
        <TabPanel className="tab-pane product-tab-description">
          <div className="row mt-6">
            <div className="col-md-6">
              <h5 className="description-title mb-4 font-weight-semi-bold ls-m">
                Features
              </h5>
              <p className="mb-2">
                <div
                  className="product-short-desc"
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                />
              </p>

            </div>
            <div className="col-md-6 pl-md-6 pt-4 pt-md-0">
              {/* <h5 className="description-title font-weight-semi-bold ls-m mb-5">Video Description</h5>
                            <figure className="p-relative d-inline-block mb-3">
                                <img src="./images/product.jpg" width="559" height="370" alt="Product" />

                                <a className="btn-play btn-iframe" href="#" data="/uploads/video/video-1.mp4" onClick={ showVideoModalHandler }>
                                    <i className="d-icon-play-solid"></i>
                                </a>
                            </figure> */}
              <div className="icon-box-wrap d-flex flex-wrap">
                <div className="icon-box icon-box-side icon-border pt-2 pb-2 mb-4 mr-10">
                  <div className="icon-box-icon">
                    <i className="d-icon-lock"></i>
                  </div>
                  <div className="icon-box-content">
                    <h4 className="icon-box-title lh-1 pt-1 ls-s text-normal">
                      14 Days Return warranty
                    </h4>
                    <p>Guarantee with no doubt</p>
                  </div>
                </div>
                {isDivider ? (
                  <div className="divider d-xl-show mr-10"></div>
                ) : (
                  ""
                )}
                <div className="icon-box icon-box-side icon-border pt-2 pb-2 mb-4">
                  <div className="icon-box-icon">
                    <i className="d-icon-truck"></i>
                  </div>
                  <div className="icon-box-content">
                    <h4 className="icon-box-title lh-1 pt-1 ls-s text-normal">
                      Free shipping
                    </h4>
                    <p>On orders over Rs.2000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel className="tab-pane product-tab-reviews">
          {product.rating_count === 0 ? (
            <div className="comments mb-2 pt-2 pb-2 border-no">
              There are no reviews yet.
            </div>
          ) : (
            <div className="comments mb-8 pt-2 pb-2 border-no">
              <ul>
                <li>
                  {reviews.map((review) => (
                    <div className="comment mb-2" key={review.id}>
                      {/* <figure className="comment-media">
                        <ALink href="#">
                          <img
                            src="./images/blog/comments/1.jpg"
                            alt="avatar"
                            width="100"
                            height="100"
                          />
                        </ALink>
                      </figure> */}
                      <div className="comment-body">
                        <div className="comment-rating ratings-container mb-0">
                         
                        </div>
                        <div className="comment-user">

                          <h4>
                            <ALink href="#">{review?.customer?.first_name || "Jhon Cena"}</ALink>
                          </h4>
                          <div className="ratings-full">
                            <span
                              className="ratings"
                              style={{ width: review.ratings * 20 + "%" }}
                            ></span>
                            <span className="tooltiptext tooltip-top">
                              {toDecimal(review.ratings)}
                            </span>
                          </div>
                          {/* <span className="comment-date text-body">
                           ({formatDate(review.created_at)})
                          </span> */}
                        </div>

                        <div className="comment-content">
                          <p>
                            {review.content}
                          </p>
                          <div className="comment-media-div">
                          {review?.images?.length > 0 &&
                            review.images?.map((image) => (
                              <figure className="comment-media">

                                <div key={image.id}>
                                  {console.log("images array", image)}
                                  <img
                                    src={image.url}
                                    alt="avatar"
                                    width="100"
                                    height="100"
                                    onClick={() => showImageModalHandler(review.images)}
                                  />
                                </div>
                              </figure>))}</div>
                        </div>

                      </div>

                    </div>
                  ))}
                </li>


              </ul>
            </div>
          )}
          <PostReview reviews={reviews} product={product} />

        </TabPanel>
      </div>
    </Tabs>
    <ImageModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        images={selectedImages}
      />
    </div>
  );
}

export default connect("", { openModal: modalActions.openModal })(DescOne);
