import React, { useState } from "react";
import { useSelector } from "react-redux";
import { postProductReview } from "~/server/axiosApi";

const PostReview = ({ reviews, product }) => {
    const user = useSelector((state) => state.user.user);
    const [rating, setRating] = useState(null);
    const [content, setContent] = useState("");

    const handleRating = (e) => {
        e.preventDefault();
        const selectedRating = parseInt(e.currentTarget.getAttribute("data-rating"));
        setRating(selectedRating);
    };

    const handlePostReview = async (e) => {
        e.preventDefault();
        console.log('handlePostReview called');

        if (rating === null || !content.trim()) {
           
            return;
        }

        const body = {
            product_id: product?.id,
            rating: rating,
            customer_id: user?.id,
            content: content,
        };

        try {
            const res = await postProductReview(body);
            console.log("review res is ", res);
           
            // Optionally clear the form
            setRating(null);
            setContent("");
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("An error occurred while submitting the review.");
        }
    };
    return (
        <>
            {user && user?.id ? (
                <div className="reply">
                    <div className="title-wrapper text-left">
                        <h3 className="title title-simple text-left text-normal">
                            {reviews.length > 0
                                ? "Add a Review"
                                : "Be The First To Review “" + product.title + "”"}
                        </h3>
                        <p>
                            Your email address will not be published. Required fields are
                            marked *
                        </p>
                    </div>
                    <div className="rating-form">
                        <label htmlFor="rating" className="text-dark">
                            Your rating *{" "}
                        </label>
                        <span className="rating-stars selected">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <a
                                    key={num}
                                    href="#"
                                    data-rating={num}
                                    onClick={handleRating}
                                    className={`star-${num} ${rating === num ? "active" : ""}`}
                                >
                                    {num}
                                </a>
                            ))}
                        </span>
                    </div>
                    <div>
                        <textarea
                            id="reply-message"
                            cols="30"
                            rows="6"
                            className="form-control mb-4"
                            placeholder="Comment *"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                        <div className="form-checkbox mb-4">
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                id="signin-remember"
                                name="signin-remember"
                            />
                            <label className="form-control-label" htmlFor="signin-remember">
                                Save my name, email, and website in this browser for the next
                                time I comment.
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-rounded" onClick={handlePostReview}>
                            Submit<i className="d-icon-arrow-right"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Login to add a review</p>
                </div>
            )}
        </>
    );
};

export default PostReview;
