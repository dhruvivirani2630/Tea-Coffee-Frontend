const Pagination = ({ page, pageCount, onPageChange }) => (
  <div className="pagination">
    <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
      Prev
    </button>
    <span>
      Page {page} of {pageCount || 1}
    </span>
    <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount}>
      Next
    </button>
  </div>
);

export default Pagination;
