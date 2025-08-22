import PropTypes from "prop-types";
function InfoCard({ title, value, details = [] }) {
  return (
    <div className="!border p-5 shadow-md rounded-2xl bg-white !space-y-1.5 flex-1">
      {/* Title */}
      <p className="font-semibold text-slate-500">{title}</p>

      {/* Main Value */}
      <p className="text-3xl font-bold text-slate-800">{value}</p>

      {/* Details */}
      {details.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-slate-500 text-sm">
          {details.map((detail, idx) => (
            <li key={idx}>
              <p>
                <span className="!font-bold pr-1">•</span>
                {detail.label}:{" "}
                <span className="font-semibold">{detail.value}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  details: PropTypes.array,
};

export default InfoCard;
