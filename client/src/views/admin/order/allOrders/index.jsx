/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from "react";
import { MdCancel } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Dialog_Boxes, localStorageData } from "../../../../utils/constant";
import {
  AddOrderItemAction,
  getAllOrderItemsAction,
  deleteSingleItemOrderAction,
  updateSingleItemOrderAction,
} from "../../../../redux/action/OrderItems";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import AddEditItemModal from "./components/AddEditItemModal";
import PageLoader from "../../../../components/UI/Loader";
import { Input } from "../../../../components/common/InputField";
import { PageHeading } from "../../../../components/UI/PageHeading";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import ItemMenuCard from "./components/ItemMenuCard";

export default function AllOrders() {
  const dispatch = useDispatch();
  const userId = useMemo(
    () =>
      JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA))?.result
        ?._id,
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [allItemsData, setAllItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isPermitted, setIsPermitted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useCallback(() => {
    const results = allItemsData.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, allItemsData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, allItemsData, handleSearch]);

  const handleSubmitItemOrder = (data) => {
    const actionPromise = editItem
      ? dispatch(updateSingleItemOrderAction(editItem._id, data))
      : dispatch(AddOrderItemAction(data));

    setEditItem(null);

    const AddOrEditItemPromise = actionPromise.then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(res?.data);
        });
      } else {
        throw new Error(res.message);
      }
    });
  };

  const handleDeleteItem = (product) => {
    const deleteItemPromise = dispatch(
      deleteSingleItemOrderAction(product._id)
    ).then((res) => {
      if (res.success) {
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) setAllItemsData(res?.data);
        });
        return res.message;
      } else {
        throw new Error("Error Deleting Item");
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allItemsRes = await dispatch(getAllOrderItemsAction());

        if (!allItemsRes.success) {
          if (allItemsRes.status === 403) setIsPermitted(false);
        } else {
          setAllItemsData(allItemsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userId]);

  if (!isPermitted) return <ForbiddenPage isPermitted={isPermitted} />;

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className=" min-h-screen">
      <PageHeading title="Create Menu" />
      <div className="flex justify-between gap-2 mb-4 ">
        <div className="flex items-center flex-1 min-w-[350px] w-full">
          <Input
            label="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <MdCancel
              size={20}
              className="cursor-pointer ml-4 text-gray-400 hover:text-red-400"
              onClick={() => {
                setSearchTerm("");
                setFilteredItems([]);
              }}
            />
          )}
        </div>

        <PrimaryActionButton
          className="h-10"
          onClick={() => setIsModalOpen(true)}
        >
          Add Items
          <FiPlusCircle size={20} />
        </PrimaryActionButton>
      </div>

      <AddEditItemModal
        isOpen={isModalOpen}
        itemData={editItem}
        onSubmit={handleSubmitItemOrder}
        onClose={() => {
          setEditItem(null);
          setIsModalOpen(false);
        }}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6 !border !border-light-primary rounded-xl  px-4
      py-6"
      >
        {(filteredItems.length > 0 ? filteredItems : allItemsData).map(
          (item) => (
            <ItemMenuCard
              key={item._id}
              handleDeleteItem={() =>
                Dialog_Boxes.showDeleteConfirmation(() =>
                  handleDeleteItem(item)
                )
              }
              handleEditItem={() => {
                setEditItem(item);
                setIsModalOpen(true);
              }}
              item={item}
            />
          )
        )}
        {/* <div
              key={item._id}
              className="p-4 mb-4 border border-gray-200 rounded-lg shadow-lg flex items-center justify-between bg-white"
            >
              <div className="flex items-center">
                <img
                  className="rounded-lg w-20 h-20 object-cover shadow mr-4"
                  src={item?.pic}
                  alt="Food-Image"
                />
                <div>
                  <div className="font-bold text-lg text-teal-600">
                    {item?.itemName} ({item?.category})
                  </div>
                  <div className="text-md text-gray-600">
                    {formatToGermanCurrency(item?.basePrice)}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="text-blue-500 hover:text-blue-700 transition"
                  title="Edit"
                  onClick={() => {
                    setEditItem(item);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete"
                  onClick={() =>
                    Dialog_Boxes.showDeleteConfirmation(() =>
                      handleDeleteItem(item)
                    )
                  }
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          )
        )} */}
      </div>
    </div>
  );
}
