import Router from "express";
import { reviewsData } from "../models/reviews.js";

const reviewsRouter = Router();

//GET route for rendering Pug template
reviewsRouter.get("/", (_, res) => {
  res.render("reviews", { reviewsProp: reviewsData });
});

//GET route to render the thank-you Pug template
reviewsRouter.get("/thank-you", (req, res) => {
  res.render("thank-you"); 
});

//Query Parameters
//GET route for fetching all reviews
reviewsRouter.get("/api", (req, res) => {
  const { movieId, userName } = req.query;

  //filtering reviews based on 'Query Parameters'
  let filteredReviews = reviewsData;

  if (movieId) {
    filteredReviews = filteredReviews.filter(
      (review) => review.movieId === parseInt(movieId)
    );
  }
  if (userName) {
    filteredReviews = filteredReviews.filter(
      (review) => review.userName === userName
    );
  }
//check if there are no reviews
if (filteredReviews.length === 0) {
  return res.status(204).send({ message: "No content found." }); 
}
  res.json(filteredReviews);
});

//Route Parameters
//GET route for fetching a review by reviewId
reviewsRouter.get("/:reviewId", (req, res) => {
  const { reviewId } = req.params;

  const existingReview = reviewsData.find(
    (r) => r.reviewId === parseInt(reviewId)
  );
  if (!existingReview) {
    return res.status(404).json({ message: "Review not found." });
  }

  res.json(existingReview);
});

//PUT route for updating an existing review
reviewsRouter.put("/:reviewId", (req, res) => {
  const { reviewId } = req.params;
  const { movieId, userName, reviewText, rating } = req.body;

  const existingReview = reviewsData.find(
    (r) => r.reviewId === parseInt(reviewId)
  );
  if (!existingReview) {
    return res.status(404).json({ message: "Review not found." });
  }

  existingReview.movieId = movieId || existingReview.movieId;
  existingReview.userName = userName || existingReview.userName;
  existingReview.reviewText = reviewText || existingReview.reviewText;
  existingReview.rating = rating || existingReview.rating;

  res.json(existingReview);
});

//POST route for submitting a new review
reviewsRouter.post("/submit-review", (req, res) => {
  const { movie, userName, reviewText, rating } = req.body;

  const newReview = {
    reviewId: reviewsData.length + 1,
    movieTitle: movie, 
    reviewText,
    rating,
    dateCreated: new Date().toISOString().split("T")[0],
  };
  reviewsData.push(newReview);

  //check if the request came from an API (to return JSON) or a regular user
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    //respond with JSON for API requests
    return res.status(201).json(newReview);
  }

  //redirect to thank-you page for regular users
  res.redirect("/reviews/thank-you");
});

//DELETE route for deleting a review
reviewsRouter.delete("/:reviewId", (req, res) => {
  const { reviewId } = req.params;

  const reviewIndex = reviewsData.findIndex(
    (r) => r.reviewId === parseInt(reviewId)
  );
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found." });
  }

  reviewsData.splice(reviewIndex, 1);
  res.status(204).send();
});

export default reviewsRouter;
