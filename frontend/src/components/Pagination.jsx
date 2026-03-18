import PropTypes from 'prop-types';
import './Pagination.css';

// Pagination component
function Pagination({
  totalMovies,
  startIndex,
  endIndex,
  safeCurrentPage,
  totalPages,
  visiblePageNumbers,
  onPageChange,
}) {
  if (totalMovies <= 0) {
    return null;
  }

  return (
    <div className="pagination-box">
      <p className="pagination-summary">
        Showing {startIndex + 1}-{Math.min(endIndex, totalMovies)} of {totalMovies}{' '}
        movies
      </p>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-button"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          Previous
        </button>

        {visiblePageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={
              pageNumber === safeCurrentPage
                ? 'pagination-button active-page-button'
                : 'pagination-button'
            }
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="pagination-button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  totalMovies: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  safeCurrentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  visiblePageNumbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;