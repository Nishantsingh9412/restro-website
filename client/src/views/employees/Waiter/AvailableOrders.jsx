import { Flex, Grid, Heading, Text, Spinner } from "@chakra-ui/react";
import OrderCard from "../components/DineInOrderCard";
import ActiveOrder from "../components/DineInActiveOrder";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getWaiterActiveOrderAction,
  getWaiterAllOrdersAction,
  updateOrderStatusActon,
} from "../../../redux/action/waiter";
import { Dialog_Boxes, statuses } from "../../../utils/constant";

export default function AvailableOrders() {
  const availableOrders = useSelector((state) => state.waiter.orders || []);
  const activeOrder = useSelector((state) => state.waiter.activeOrder);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleAccept = (id) => {
    dispatch(
      updateOrderStatusActon({ orderId: id, status: statuses.ACCEPTED })
    );
  };

  const handleCancel = (id) => {
    dispatch(
      updateOrderStatusActon({ orderId: id, status: statuses.CANCELLED })
    );
  };

  const handleReject = (id) => {
    dispatch(
      updateOrderStatusActon({ orderId: id, status: statuses.REJECTED })
    );
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(updateOrderStatusActon({ orderId: id, status: status }));
    if (status === statuses.COMPLETED || status === statuses.CANCELLED) {
      dispatch(getWaiterAllOrdersAction());
      return Dialog_Boxes.showOrderCompleted();
    }
  };

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
  }, [dispatch]);

  if (loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (activeOrder) {
    return (
      <ActiveOrder
        activeOrder={activeOrder}
        handleCancel={(id) =>
          Dialog_Boxes.showCancelConfirmation(id, handleCancel)
        }
        handleUpdateStatus={(id, status) =>
          Dialog_Boxes.showStatusChangeConfirm(id, status, handleUpdateStatus)
        }
      />
    );
  } else
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
            {availableOrders?.map((order, i) => (
              <OrderCard
                data={order}
                key={i}
                handleAccept={(id) =>
                  Dialog_Boxes.showAcceptConfirmation(id, handleAccept)
                }
                handleReject={(id) =>
                  Dialog_Boxes.showRejectConfirmation(id, handleReject)
                }
                disabled={activeOrder ? true : false}
              />
            ))}
          </Grid>
        )}
      </>
    );
}
