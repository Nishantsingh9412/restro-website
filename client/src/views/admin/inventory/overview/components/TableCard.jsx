import PropTypes from "prop-types";

const TableCard = ({ tableData }) => {
  return (
    <div className="bg-white rounded-xl my-2 !border !border-gray-200 overflow-x-auto max-h-[75vh] hidden md:block">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-primary text-white h-12 sticky top-0 z-10">
            <th className="py-2 px-8 text-left font-semibold border-b border-gray-300">
              Date
            </th>
            <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
              Item Name
            </th>
            <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
              Action
            </th>
            <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
              Quantity
            </th>
            <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
              User
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No Action History
              </td>
            </tr>
          ) : (
            tableData.map((entry) => (
              <tr key={entry._id} className="even:bg-[#ebebfa] odd:bg-white">
                <td className="py-3 px-8 text-gray-700">
                  {entry?.timestamp
                    ? new Date(entry.timestamp).toLocaleDateString("en-GB")
                    : "--"}
                </td>
                <td className="py-3 px-4 text-gray-700">{entry.itemName}</td>
                <td className="py-3 px-4 text-gray-700">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      entry.actionType === "added"
                        ? "bg-green-100 text-green-700"
                        : entry.actionType === "removed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {entry?.actionType[0]?.toUpperCase() +
                      entry?.actionType.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{entry.quantity}</td>
                <td className="py-4 px-4 text-gray-700">{entry.userName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
TableCard.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      item_name: PropTypes.string,
      available_quantity: PropTypes.number,
    })
  ),
};

export default TableCard;
