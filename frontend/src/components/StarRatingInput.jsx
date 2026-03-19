import PropTypes from 'prop-types';
import './StarRatingInput.css';

// Star rating selector component
function StarRatingInput({ value, hoverValue, onHoverChange, onValueChange }) {
  return (
    <div className="star-rating" onMouseLeave={() => onHoverChange(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const activeValue = hoverValue || Number(value);

        return (
          <button
            key={star}
            type="button"
            className={
              star <= activeValue
                ? 'star-icon-button active-star'
                : 'star-icon-button'
            }
            onMouseEnter={() => onHoverChange(star)}
            onClick={() => onValueChange(String(star))}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

StarRatingInput.propTypes = {
  value: PropTypes.string.isRequired,
  hoverValue: PropTypes.number.isRequired,
  onHoverChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default StarRatingInput;
