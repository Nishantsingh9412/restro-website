import { Flex, Grid, Heading, Text, Spinner } from "@chakra-ui/react";
import OrderCard from "./components/OrderCard";
import ActiveOrder from "./components/ActiveOrder";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  //   acceptOrderAction,
  //   deleteSingleOrderAction,
  //   completeOrderAction,
  //   cancelOrderAction,
  //   updateOrderStatusAction,
  getWaiterActiveOrderAction,
  getWaiterAllOrdersAction,
} from "../../../redux/action/waiter";

export default function AvailableOrders() {
  const auth = useSelector((state) => state.admin.data);
  const availableOrders = useSelector((state) => state.waiter.orders || []);
  const activeOrder = useSelector((state) => state.waiter.activeOrder);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getWaiterAllOrdersAction()),
          dispatch(getWaiterActiveOrderAction()),
        ]);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showAcceptConfirmation = () =>
    Swal.fire({
      title: "Order Accepted",
      text: "Complete the order to get more order offers",
      icon: "success",
      confirmButtonColor: "skyblue",
      timer: 2500,
      timerProgressBar: true,
    });

  const showStatusChangeConfirm = (id, status) =>
    Swal.fire({
      title: "Change Status to " + status,
      text: `Confirm that you have ${status.toLowerCase()} the order`,
      icon: "success",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleUpdateStatus(id, status);
    });

  const showOrderCompleted = () =>
    Swal.fire({
      title: "Order Completed",
      text: "You can earn more, get more orders",
      icon: "success",
      confirmButtonColor: "skyblue",
    });

  const showRejectConfirmation = (id) =>
    Swal.fire({
      title: "Reject order offer?",
      text: "Are you sure you want to reject this offer?",
      icon: "question",
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleReject(id);
    });

  const showCancelConfirmation = (id) =>
    Swal.fire({
      title: "Cancel order in progress?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleCancel(id);
    });

  const handleReject = (id) => {
    console.log(id);
    // dispatch(deleteSingleOrderAction(id));
  };

  const handleCompleteOrder = (id) => {
    // dispatch(completeOrderAction(id, auth?._id)).then(() =>
      showOrderCompleted()
    // );
  };

  const handleUpdateStatus = (id, status) => {
    // if (status === "Completed") return handleCompleteOrder(id);
    // dispatch(updateOrderStatusAction(id, status, auth?._id));
  };

  const handleAccept = (id) => {
    // dispatch(acceptOrderAction(id, auth?._id)).then(() =>
      showAcceptConfirmation()
    // );
  };

  const handleCancel = (id) => {
    // dispatch(cancelOrderAction(id, auth?._id));
  };

  if (loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (activeOrder && activeOrder.length > 0)
    return (
      <ActiveOrder
        activeOrder={activeOrder}
        handleCancel={showCancelConfirmation}
        handleUpdateStatus={showStatusChangeConfirm}
      />
    );
  else
    return (
      <>
        <Heading mt={20} mb={5} fontSize={20}>
          Available Orders
        </Heading>
        {availableOrders.length === 0 ? (
          <Text
            p={3}
            w={"fit-content"}
            bg={"rgba(255, 255, 255, 0.5)"}
            mx={"auto"}
            my={20}
          >
            You don&apos;t have any order offer at this moment
          </Text>
        ) : (
          <Grid
            gap={5}
            gridTemplateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
          >
            {console.log(availableOrders, activeOrder)}
            {availableOrders?.map((order, i) => (
              <OrderCard
                data={order}
                key={i}
                handleAccept={handleAccept}
                handleReject={showRejectConfirmation}
                disabled={activeOrder ? true : false}
              />
            ))}
          </Grid>
        )}
      </>
    );
}
