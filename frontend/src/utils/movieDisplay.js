// Convert numeric rating to stars
export function renderStars(value) {
  const number = Number(value);

  if (Number.isNaN(number) || number < 1 || number > 5) {
    return '';
  }

  return '★'.repeat(number) + '☆'.repeat(5 - number);
}

// Convert average rating to stars
export function renderAverageStars(value) {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '';
  }

  const roundedStars = Math.round(number);

  return '★'.repeat(roundedStars) + '☆'.repeat(5 - roundedStars);
}

// Format average rating to 1 decimal place
export function formatAverageRating(value) {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '';
  }

  return `${number.toFixed(1)} / 5.0`;
}

// Show current user's movie status
export function formatUserStatus(value) {
  if (value === 'wantToWatch') {
    return 'Want to Watch';
  }

  if (value === 'watched') {
    return 'Watched';
  }

  return 'Not in Your List';
}

// Calculate visible page numbers
export function getVisiblePageNumbers(totalPages, page) {
  const pages = [];

  if (totalPages <= 5) {
    for (let index = 1; index <= totalPages; index += 1) {
      pages.push(index);
    }

    return pages;
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (page >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [page - 2, page - 1, page, page + 1, page + 2];
}