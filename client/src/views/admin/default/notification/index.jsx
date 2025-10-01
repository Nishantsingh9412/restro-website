import { useDispatch, useSelector } from "react-redux";
import { PageFooter } from "../../../../components/UI/PageFooter.jsx";
import { PageHeading } from "../../../../components/UI/PageHeading.jsx";
import NotificationRow from "./NotificationRow.jsx";
import { useEffect, useState } from "react";
import { useUser } from "../../../../hooks/useUser.js";
import { getAllNotifications } from "../../../../redux/action/notificationSlice.js";
import PageLoader from "../../../../components/UI/Loader.jsx";

export default function NotificationsTable() {
  const dispatch = useDispatch();
  const { userRole } = useUser();
  const [selectedRows, setSelectedRows] = useState({});
  const { data: notifications, isLoading } = useSelector(
    (state) => state.notificationReducer
  );

  useEffect(() => {
    dispatch(getAllNotifications(userRole));
  }, [dispatch, userRole]);

  const toggleSelect = (id) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  // Loader component to show while data is being fetched
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen px-2 py-4">
      {/* Page Heading */}
      <PageHeading title="Notifications" />

      {/* Search & Action Area */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mb-4">
        {/* Example future dropdown (commented) */}
        {/* <select className="border border-gray-300 rounded px-2 py-1">
          <option>Action</option>
        </select> */}
        <input
          type="text"
          placeholder="Search Notification"
          className="w-full md:w-64 !px-3 !py-1 !border !border-gray-300 rounded outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-auto">
        <table className="min-w-max w-full table-auto ">
          <thead>
            <tr className="text-sm bg-gray-100 text-gray-600">
              <th className="hidden lg:table-cell px-4 py-3">
                <input
                  type="checkbox"
                  className="form-checkbox accent-purple-500"
                />
              </th>
              <th className="hidden lg:table-cell px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Notification</th>
              <th className="px-4 py-3 font-medium">Person</th>
              <th className="hidden lg:table-cell px-4 py-3 font-medium">
                Issued Date
              </th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications?.map((item, idx) => (
              <NotificationRow
                key={idx}
                id={item?._id}
                heading={item?.heading}
                text={item?.body}
                person={item?.sender}
                date={item?.createdAt}
                selected={!!selectedRows[item?._id]}
                onSelect={() => toggleSelect(item?._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PageFooter />
    </div>
  );
}
