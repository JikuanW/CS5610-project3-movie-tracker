import { ObjectId } from 'mongodb';

// Trim text input
function getTrimmedText(value) {
  return value ? String(value).trim() : '';
}

// Validate ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

// Read movie form input
function getMovieInput(body) {
  return {
    title: getTrimmedText(body.title),
    genre: getTrimmedText(body.genre),
    description: getTrimmedText(body.description),
    releaseYearText: getTrimmedText(body.releaseYear),
  };
}

// Validate movie form input
function validateMovieInput(movieInput) {
  const { title, genre, description, releaseYearText } = movieInput;

  if (!title || !genre || !description || !releaseYearText) {
    return {
      isValid: false,
      message: 'All fields are required',
    };
  }

  if (!/^\d{4}$/.test(releaseYearText)) {
    return {
      isValid: false,
      message: 'Release year must be exactly 4 digits',
    };
  }

  return {
    isValid: true,
    value: {
      title,
      genre,
      description,
      releaseYear: Number(releaseYearText),
    },
  };
}

// Read rating and review input
function getReviewInput(body) {
  return {
    rating: getTrimmedText(body.rating),
    review: getTrimmedText(body.review),
  };
}

// Validate rating and review input
function validateReviewInput(reviewInput) {
  const { rating, review } = reviewInput;

  if (!rating || !review) {
    return {
      isValid: false,
      message: 'Rating and review are required',
    };
  }

  return {
    isValid: true,
    value: reviewInput,
  };
}

export {
  getTrimmedText,
  isValidObjectId,
  getMovieInput,
  validateMovieInput,
  getReviewInput,
  validateReviewInput,
};
