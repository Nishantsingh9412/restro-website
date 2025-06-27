import PropTypes from "prop-types";

export function PageFooter({
  page = 1,
  totalRows = 0,
  rowsPerPage = 10,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  rowsPerPageOptions = [10, 25, 50],
}) {
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const from = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, totalRows);

  return (
    <div className="flex justify-between items-center my-4 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <label htmlFor="rows" className="">
          Rows per page:
        </label>
        <select
          id="rows"
          className="bg-transparent border border-gray-600 text-white px-2 py-1 rounded"
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(Number(e.target.value))}
        >
          {rowsPerPageOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <p>{from}–{to} of {totalRows}</p>
        <button
          className="!text-xl disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          &lt;
        </button>
        <button
          className="!text-xl disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

PageFooter.propTypes = {
  page: PropTypes.number,
  totalRows: PropTypes.number,
  onPageChange: PropTypes.func,
  rowsPerPage: PropTypes.number,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};
