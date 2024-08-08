import React, { useState, useEffect } from "react";
import { toDecimal } from "~/utils";
import Pagination from "~/components/features/pagination";
import ALink from "~/components/features/custom-link";

const ProductReviews = ({ reviews, showImageModalHandler }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        // Update the reviews to display based on the current page
    }, [currentPage]);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
        <div>
            {currentReviews.map((review) => (
                <div className="comment mb-2" key={review.id}>
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
                        </div>
                        <div className="comment-content">
                            <p>{review.content}</p>
                            <div className="comment-media-div">
                                {review?.images?.length > 0 &&
                                    review.images?.map((image) => (
                                        <figure className="comment-media" key={image.id}>
                                            <img
                                                src={image.url}
                                                alt="avatar"
                                                width="100"
                                                height="100"
                                                onClick={() => showImageModalHandler(review.images)}
                                            />
                                        </figure>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Pagination
                totalPage={totalPages}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    );
};

export default ProductReviews;
