import { useEmployeeDashboard } from "../../../../hooks/useEmployeeDashboard";
import PageLoader from "../../../../components/UI/Loader";
import { PageHeading } from "../../../../components/UI/PageHeading";

export default function EmployeeDashboard() {
  const { loading } = useEmployeeDashboard();

  // Demo data (replace with real data from hooks/store as needed)
  const employeeShift = [
    {
      _id: "2",
      employeeId: { name: "Jane Smith" },
      role: "Delivery",
      status: "Working",
      from: new Date(new Date().setHours(new Date().getHours() + 1)),
      to: new Date(new Date().setHours(new Date().getHours() + 9)),
      duration: 8,
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
    {
      _id: "1",
      employeeId: { name: "John Doe" },
      role: "Delivery",
      status: "Offline",
      from: new Date(),
      to: new Date(new Date().setHours(new Date().getHours() + 8)),
      duration: 8,
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
    {
      _id: "3",
      employeeId: { name: "Jane Doe" },
      role: "Manger",
      status: "Working",
      from: new Date(new Date().setHours(new Date().getHours() + 1)),
      to: new Date(new Date().setHours(new Date().getHours() + 9)),
      duration: 8,
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
  ];

  const employeeAbsense = [
    {
      _id: "1",
      employeeId: { name: "John Doe" },
      leaveType: "Sick Leave",
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      notes: "Feeling unwell, unable to work today.",
    },
    {
      _id: "2",
      employeeId: { name: "Jane Smith" },
      leaveType: "Vacation",
      notes: "On vacation until next week.",
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
    {
      _id: "3",
      employeeId: { name: "Alice Johnson" },
      leaveType: "FULL TIME",
      notes: "N/A",
      pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
  ];

  const birthdays = {
    today: [
      {
        _id: "1",
        name: "Alice Wonderland",
        role: "Chef",
        dob: new Date().toISOString(), // Today's date
        pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      },
    ],
    upcoming: [
      {
        _id: "2",
        name: "Bob The Builder",
        role: "Manager",
        dob: new Date(
          new Date().setDate(new Date().getDate() + 5)
        ).toISOString(), // 5 days from now
        pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      },
      {
        _id: "3",
        name: "Charlie Chaplin",
        role: "Waiter",
        dob: new Date(
          new Date().setDate(new Date().getDate() + 10)
        ).toISOString(), // 10 days from now
        pic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      },
    ],
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageHeading title={"Employee Dashboard"} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-6 p-2 md:p-4 xl:p-6 ">
        {/* Main Content */}
        <div className="flex flex-col gap-6 w-full order-2 xl:order-1">
          {/* Absent Employees */}
          <section className="bg-white rounded-xl shadow-sm !border !border-primary p-4 md:p-6 w-full overflow-auto">
            <h2 className="!text-md md:!text-lg !font-semibold !mb-4 text-primary">
              Absent Employees
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold">Name</th>
                    <th className="py-2 px-4 text-left font-semibold">
                      Absence Type
                    </th>
                    <th className="py-2 px-4 text-left font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAbsense && employeeAbsense.length > 0 ? (
                    employeeAbsense.map((val) => (
                      <tr
                        key={val._id}
                        className="even:!bg-[#e3eaf8] odd:bg-white"
                      >
                        <td className="py-2 px-4">
                          <div className="flex gap-2 items-center">
                            <img
                              src={val.pic}
                              alt={val.employeeId ? val.employeeId.name : "N/A"}
                              className="!w-10 !h-10 rounded-full object-cover border !hidden sm:!block"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {val.employeeId ? val.employeeId.name : "N/A"}
                              <br />
                              <span className="text-xs text-gray-400">
                                {val?.role || "N/A"}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4">{val.leaveType}</td>
                        <td className="py-2 px-4">
                          <div className="w-15 md:w-full truncate">
                            {val.notes}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 text-center text-gray-500"
                      >
                        No Absences Recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {/* Employee Shifts */}
          <section className="bg-white rounded-xl shadow-sm !border !border-primary p-4 md:p-6 w-full overflow-auto">
            <h2 className="!text-md md:!text-lg !font-semibold !mb-4 text-primary">
              Employee Shifts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold">Name</th>
                    <th className="py-2 px-4 text-left font-semibold">
                      Status
                    </th>
                    {/* <th className="py-2 px-4 text-left font-semibold">From</th>
                    <th className="py-2 px-4 text-left font-semibold">To</th> */}
                    <th className="py-2 px-4 text-left font-semibold">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeShift && employeeShift.length > 0 ? (
                    employeeShift.map((val) => (
                      <tr
                        key={val._id}
                        className="even:bg-[#e3eaf8] odd:bg-white"
                      >
                        <td className="py-2 px-4">
                          <div className="flex gap-2 items-center">
                            <img
                              src={val.pic}
                              alt={val.employeeId ? val.employeeId.name : "N/A"}
                              className="!w-10 !h-10 rounded-full object-cover border !hidden sm:!block"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {val.employeeId ? val.employeeId.name : "N/A"}
                              <br />
                              <span className="text-xs text-gray-400">
                                {val?.role || "N/A"}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold
                              ${
                                val.status === "Working"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {val.status ? val.status : "N/A"}
                          </span>
                        </td>
                        {/* <td className="py-2 px-4">
                          {new Date(val.from).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(val.to).toLocaleDateString()}
                        </td> */}
                        <td className="py-2 px-4">{val.duration} Hours</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-gray-500"
                      >
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        {/* Sidebar - Birthdays */}
        <aside className="w-full max-w-full xl:max-w-md 2xl:max-w-lg flex-shrink-0 mx-auto xl:mx-0 order-1 xl:order-2">
          <div className="shadow-md bg-white p-6 md:p-8 rounded-xl !border w-full">
            <h2 className="!text-xl !font-bold text-[#3f4962]">Birthdays</h2>

            {/* Today’s Birthday */}
            <h3 className="!text-lg !font-semibold !mt-4 text-gray-600">
              Today
            </h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : birthdays.today?.length > 0 ? (
              <ul className="flex flex-col gap-4 mt-3">
                {birthdays.today?.map((employee, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm border border-blue-100"
                  >
                    <img
                      src={
                        employee.pic ||
                        "https://placehold.co/80x80?text=No+Image"
                      }
                      alt={employee.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-blue-200 shadow"
                    />
                    <div>
                      <div className="text-base md:text-lg font-semibold text-blue-900">
                        {employee.name}
                      </div>
                      {employee.role && (
                        <div className="text-xs text-blue-500 font-medium mt-1 uppercase tracking-wide">
                          {employee.role}
                        </div>
                      )}
                      {employee.dob && (
                        <div className="text-xs text-gray-400 mt-1">
                          🎂{" "}
                          {new Date(employee.dob).toLocaleDateString(
                            undefined,
                            { month: "long", day: "numeric" }
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                There is no birthday today.
              </div>
            )}
            {/* Upcoming Birthdays */}
            <h3 className="!text-lg !font-semibold !mt-6 text-gray-600">
              Upcoming Birthdays
            </h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : birthdays.upcoming?.length > 0 ? (
              <ul className="!mt-2 space-y-2">
                {birthdays.upcoming?.map((employee, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-center gap-2"
                  >
                    <span className="inline-block w-7 h-7 rounded-full bg-blue-100 border border-blue-200 overflow-hidden">
                      <img
                        src={
                          employee.pic ||
                          "https://placehold.co/28x28?text=No+Img"
                        }
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    <span>{employee.name}</span>
                    {employee.dob && (
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(employee.dob).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                There are no upcoming birthdays.
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
