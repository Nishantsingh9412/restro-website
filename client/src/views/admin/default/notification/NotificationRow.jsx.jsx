import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaEllipsisV } from "react-icons/fa";
import { formatDateForUI } from "../../../../utils/utils";
import { useState } from "react";

export default function NotificationRow({
  id,
  heading,
  text,
  person,
  date,
  selected,
  onSelect,
  hidden,
}) {
  const [toggle, setToggle] = useState(true);

  return (
    <tr
      className={`!border-b ${
        selected ? "bg-gray-100 dark:bg-gray-300" : "hover:bg-gray-100"
      } transition`}
    >
      <td className="hidden lg:table-cell px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="form-checkbox accent-purple-500"
        />
      </td>

      <td className="hidden lg:table-cell px-2 py-3 text-purple-500 font-medium">
        #{id?.slice(0, 5)}
      </td>

      <td
        className="px-4 py-3 text-sm text-gray-600 break-words max-w-xs md:max-w-md cursor-pointer"
        onClick={() => setToggle((v) => !v)}
      >
        <p className="font-medium">{heading}</p>
        <p className="text-xs text-gray-500">
          {text?.length > 70 && toggle ? `${text.slice(0, 70)}...` : text}
        </p>
      </td>

      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-3 max-w-xs">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt={person?.name?.slice(0, 2)}
            className="hidden lg:block w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
          <div className="truncate">
            <p className="font-medium text-gray-500">{person?.name}</p>
            <p className="text-xs text-gray-400 truncate">{person?.email}</p>
          </div>
        </div>
      </td>

      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
        {formatDateForUI(date)}
      </td>

      <td className="px-4 py-3 flex items-center justify-evenly gap-3 text-gray-500 text-sm">
        <button title="Toggle View">
          {hidden ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button title="More Actions">
          <FaEllipsisV className="cursor-pointer" />
        </button>
      </td>
    </tr>
  );
}

NotificationRow.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  heading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  date: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
};
