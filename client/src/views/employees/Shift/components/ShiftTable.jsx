import PropTypes from "prop-types";
const ShiftTable = ({ shiftData, header }) => {
  // Function to convert time to a readable format
  const convertTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Function to convert date to a readable format
  const convertDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="!border !border-gray-300 rounded-lg overflow-hidden p-4 shadow-lg my-10 bg-white">
      {/* Header */}
      <h2 className="!text-2xl !font-bold !mb-2 text-left text-[#767680]">
        {header}
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Table Head */}
          <thead className="bg-[#767680]/20">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-[#767680]">
                Date
              </th>
              <th className="px-4 py-2 text-left font-semibold text-[#767680]">
                Hours
              </th>
              <th className="px-4 py-2 text-left font-semibold text-[#767680]">
                Shift Start
              </th>
              <th className="px-4 py-2 text-left font-semibold text-[#767680]">
                Shift End
              </th>
              <th className="px-4 py-2 text-left font-semibold text-[#767680]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {shiftData && shiftData.length > 0 ? (
              shiftData.map((shift, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#767680]/10 transition-colors"
                >
                  <td className="px-4 py-2 font-bold text-gray-800">
                    {shift?.date ? convertDate(shift.date) : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-3 py-1 rounded-full bg-[#767680]/20 text-[#767680] text-sm font-semibold">
                      {shift.duration || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {shift?.from ? convertTime(shift.from) : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {shift?.to ? convertTime(shift.to) : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      onClick={() => console.log("clicked")}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold cursor-pointer hover:bg-green-200 transition-colors"
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No shift available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ShiftTable.propTypes = {
  shiftData: PropTypes.object,
  header: PropTypes.string,
};

export default ShiftTable;
