import {
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import DineInOrderCard from "../components/DineInOrderCard";
import TakeAwayOrderCard from "../components/TakeAwayOrderCard";
import TakeAwayActiveOrder from "../components/TakeAwayActiveOrder";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import {
  getChefActiveOrderAction,
  getChefAllOrdersAction,
  updateOrderStatusActon,
} from "../../../redux/action/Employees/chef.js";
import { statuses, orderTypes, Dialog_Boxes } from "../../../utils/constant";
import DineInActiveOrder from "../components/DineInActiveOrder.jsx";

export default function AvailableOrders() {
  const availableOrders = useSelector((state) => state.chef.orders);
  const { dineInActiveOrder, takeAwayActiveOrder } = useSelector(
    (state) => state.chef.activeOrder
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  // const toast = useToast();

  const handleAcceptDineIn = (id) => {
    dispatch(
      updateOrderStatusActon({
        orderType: orderTypes.DINE_IN,
        orderId: id,
        status: statuses.ACCEPTED_BY_CHEF,
      })
    );
    console.log(statuses.ACCEPTED_BY_CHEF);
  };
  const handleAcceptTakeAway = (id) => {
    dispatch(
      updateOrderStatusActon({
        orderType: orderTypes.TAKE_AWAY,
        orderId: id,
        status: statuses.ACCEPTED,
      })
    );
  };

  const handleRejectDineIn = (id) => {
    dispatch(
      updateOrderStatusActon({
        orderType: orderTypes.DINE_IN,
        orderId: id,
        status: statuses.REJECTED,
      })
    );
  };

  const handleRejectTakeAway = (id) => {
    dispatch(
      updateOrderStatusActon({
        orderType: orderTypes.TAKE_AWAY,
        orderId: id,
        status: statuses.REJECTED,
      })
    );
  };

  const handleCancel = (id) => {
    dispatch(
      updateOrderStatusActon({
        orderType,
        orderId: id,
        status: statuses.CANCELLED,
      })
    );
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(
      updateOrderStatusActon({
        orderType,
        orderId: id,
        status,
      })
    );
    if (status === statuses.COMPLETED) {
      dispatch(getChefAllOrdersAction());
      return Dialog_Boxes.showOrderCompleted();
    }
  };

  const handleActiveOrder = useCallback(() => {
    if (dineInActiveOrder) {
      setOrderType(orderTypes.DINE_IN);
      return dineInActiveOrder;
    } else if (takeAwayActiveOrder) {
      setOrderType(orderTypes.TAKE_AWAY);
      return takeAwayActiveOrder;
    }
    return null;
  }, [dineInActiveOrder, takeAwayActiveOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getChefAllOrdersAction()),
          dispatch(getChefActiveOrderAction()),
        ]);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const activeOrder = handleActiveOrder();
    if (activeOrder) {
      setActiveOrder(activeOrder);
    } else {
      setActiveOrder(null);
    }
  }, [handleActiveOrder]);

  if (loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (error)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );
  if (activeOrder) {
    return orderType === orderTypes.TAKE_AWAY ? (
      <TakeAwayActiveOrder
        activeOrder={activeOrder}
        handleCancel={(id) =>
          Dialog_Boxes.showCancelConfirmation(id, handleCancel)
        }
        handleUpdateStatus={(id, status) =>
          Dialog_Boxes.showStatusChangeConfirm(id, status, handleUpdateStatus)
        }
      />
    ) : (
      <DineInActiveOrder
        activeOrder={activeOrder}
        handleCancel={(id) =>
          Dialog_Boxes.showCancelConfirmation(id, handleCancel)
        }
        handleUpdateStatus={(id, status) =>
          Dialog_Boxes.showStatusChangeConfirm(id, status, handleUpdateStatus)
        }
      />
    );
  }

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
        <>
          <Heading mt={10} mb={5} ml={2} fontSize={18}>
            Dine-In Orders
          </Heading>
          {availableOrders?.dineInOrders?.length === 0 ? (
            <Text
              p={3}
              w={"fit-content"}
              bg={"rgba(255, 255, 255, 0.5)"}
              mx={"auto"}
              my={20}
            >
              No Dine-In Orders available at this moment
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
              {availableOrders?.dineInOrders?.map((order, i) => (
                <DineInOrderCard
                  data={order}
                  key={i}
                  handleAccept={(id) =>
                    Dialog_Boxes.showAcceptConfirmation(id, handleAcceptDineIn)
                  }
                  handleReject={(id) =>
                    Dialog_Boxes.showRejectConfirmation(id, handleRejectDineIn)
                  }
                  disabled={activeOrder ? true : false}
                />
              ))}
            </Grid>
          )}
          <Heading mt={10} mb={5} ml={2} fontSize={18}>
            Takeaway Orders
          </Heading>
          {availableOrders?.takeAwayOrders?.length === 0 ? (
            <Text
              p={3}
              w={"fit-content"}
              bg={"rgba(255, 255, 255, 0.5)"}
              mx={"auto"}
              my={20}
            >
              No Takeaway Orders available at this moment
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
              {availableOrders?.takeAwayOrders?.map((order, i) => (
                <TakeAwayOrderCard
                  data={order}
                  key={i}
                  handleAccept={(id) =>
                    Dialog_Boxes.showAcceptConfirmation(
                      id,
                      handleAcceptTakeAway
                    )
                  }
                  handleReject={(id) =>
                    Dialog_Boxes.showRejectConfirmation(
                      id,
                      handleRejectTakeAway
                    )
                  }
                  disabled={activeOrder ? true : false}
                />
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
}
