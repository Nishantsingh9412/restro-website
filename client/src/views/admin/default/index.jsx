import {
  IoArrowForwardCircleOutline,
  IoBagHandleOutline,
  IoEllipsisVertical,
} from "react-icons/io5";
import { PageHeading } from "../../../components/UI/PageHeading";
import { getMonthName } from "../../../utils/utils";
import { FiCalendar } from "react-icons/fi";
import PropTypes from "prop-types";
import { Input } from "../../../components/common/InputField";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton";
import { useDashboard } from "../../../hooks/useDashboard";
import PageLoader from "../../../components/UI/Loader";
import OrderDataChart from "./components/OrderDataChart";
import InventoryTrackingChart from "./components/InventoryTracking";
import PieCard from "./components/PieCard";
import StockBarChartCard from "../inventory/overview/components/StockBarCard";

export default function Dashboard() {
  const today = new Date();
  const { dashboardData, isLoading } = useDashboard();
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageHeading title={"Overview"} />

      {/* Content */}
      <div className="grid grid-cols-2 gap-3 mb-3 min-h-screen mx-2 md:mx-4">
        <div className="h-full space-y-3 flex flex-col">
          {/* Welcome Message */}
          <div className="">
            <h2 className="!text-3xl !mt-2">
              Hi, <strong>Admin</strong> <br />
              What are your planes for today
            </h2>
            <p className=" !mt-2">
              This platform is designed to revolutionize the way you organize
              and access.
            </p>
          </div>
          {/* Inventory Tracking Chart */}
          <div className="!border !border-primary !p-4 rounded-xl mt-10 flex-1">
            <h3 className="!font-semibold">Inventory Tracking</h3>
            <InventoryTrackingChart />
          </div>
          {/* Order Insights Chart */}
          <div className="!border !border-[#FF64DA] !p-4 rounded-xl flex-1">
            <h3 className="!font-semibold">Order Data</h3>
            <OrderDataChart />
          </div>
          {/*User Activity */}
          <div className="!border !border-[#3DD7A3] !p-4 rounded-xl flex-1">
            <h3 className="!font-semibold">User Activity</h3>
            <OrderDataChart />
          </div>
        </div>
        <div className="space-y-3 h-full flex flex-col">
          {/* Stock Summary and Chart */}
          <div className="flex gap-2">
            {/* Stock Summary */}
            <div className="space-y-2">
              {/* Date */}
              <div className="flex items-baseline-last gap-4 !border !border-primary px-2 py-1 rounded-md text-xl font-medium">
                <p className="leading-tight">
                  <strong className="text-primary">{today.getDate()}</strong>{" "}
                  {getMonthName(today.getMonth())} <br />
                  {today.getFullYear()}
                </p>
                <FiCalendar />
              </div>
              {/* Total Stocks */}
              <div className="bg-yellow-300 px-2 py-1 rounded-md text-xl">
                <strong>
                  {dashboardData?.stockData?.totalStocksQuantity ?? 0}
                </strong>
                <p className="text-sm">Total Stocks</p>
              </div>
              {/* Low Stock Alert */}
              <div className="bg-red-300 px-2 py-1 rounded-md text-xl">
                <strong>
                  {dashboardData?.stockData?.lowStocksQuantity ?? 0}
                </strong>
                <p className="text-sm">Low Stocks</p>
              </div>
              {/* Expiry Alert */}
              <div className="bg-purple-300 px-2 py-1 rounded-md text-xl">
                <strong>
                  {dashboardData?.stockData?.expiredItems?.total ?? 0}
                </strong>
                <p className="text-sm">Expiry Alert</p>
              </div>
            </div>
            {/* Stock Chart */}
            <div className="!border !border-[#59D7D5] !p-4 rounded-xl flex-1">
              <h3 className="!font-semibold">Suppliers Location</h3>
              <PieCard />
            </div>
          </div>
          {/* Sales Mapping */}
          <div className="!border !border-[#FFCD09] !p-4 rounded-xl flex-1 ">
            <h3 className="!font-semibold">Sales Mapping</h3>
            <StockBarChartCard
              stockData={[
                {
                  month: "Jan",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Feb",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Mar",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Apr",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "May",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Jun",
                  purchase: 433,
                  usage: 288,
                },
                {
                  month: "Jul",
                  purchase: 0,
                  usage: 120,
                },
                {
                  month: "Aug",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Sep",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Oct",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Nov",
                  purchase: 0,
                  usage: 0,
                },
                {
                  month: "Dec",
                  purchase: 0,
                  usage: 0,
                },
              ]}
            />
          </div>
          {/* Upgrade Your Plan */}
          <div className="!border !border-[#9155FD] !p-4 rounded-xl flex-1">
            <h3 className="!font-medium">Upgrade Your Plan</h3>
            <p className="text-xs !my-2 w-2/3">
              Plase make the payment to start enjoying all the features of our
              premuim plan as soon as possible.
            </p>
            <div className="flex bg-purple-200 rounded-md justify-between px-3 py-2 items-center my-3">
              <div className="flex gap-2">
                <IoBagHandleOutline className="text-4xl p-1 rounded text-primary !border !border-primary" />
                <div>
                  <p className="leading-tight font-medium text-sm">Platinum</p>
                  <p className="text-xs text-primary">Upgrade Plan</p>
                </div>
              </div>
              <p className="text-lg">
                <sup>$</sup>
                <strong>5,250</strong>/Year
              </p>
            </div>
            <Input type="email" label="Email Address" />
            <PrimaryActionButton
              className="w-full !py-2 flex justify-center"
              bgColor="!bg-purple-500 hover:!bg-purple-600"
            >
              Contact Now
            </PrimaryActionButton>
          </div>
          {/* Contacts */}
          <div className="!border !border-primary !p-4 rounded-xl flex-1 max-h-112 overflow-x-auto">
            <div className="flex justify-between">
              <h3 className="!font-semibold">Contacts</h3>
              <IoArrowForwardCircleOutline className="text-2xl" />
            </div>
            {dashboardData?.suppliers?.map((supplier) => (
              <ContactRowItem
                key={supplier._id || supplier.name}
                name={supplier.name}
                phone={supplier.phone}
                imgSrc={supplier.pic}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const ContactRowItem = ({ name, phone, imgSrc }) => (
  <div className="flex justify-between items-center mt-3 mx-3">
    <div className="flex gap-3 items-center">
      <img
        src={
          imgSrc ??
          "https://as1.ftcdn.net/v2/jpg/02/99/04/20/1000_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
        }
        className="w-10 !h-10 rounded-full object-cover"
        alt={name}
      />
      <div className="leading-tight">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-primary text-xs">{phone}</p>
      </div>
    </div>
    <IoEllipsisVertical className="text-lg" />
  </div>
);

ContactRowItem.propTypes = {
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
};
