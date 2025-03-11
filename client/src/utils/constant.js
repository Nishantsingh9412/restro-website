import Swal from "sweetalert2";

const statuses = {
  ACCEPTED: "Accepted",
  AVAILABLE: "Available",
  ASSIGNED: "Assigned",
  ASSIGNED_TO_CHEF: "Assigned To Chef",
  ACCEPTED_BY_CHEF: "Accepted By Chef",
  COMPLETED: "Completed",
  PREPARING: "Preparing",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
};

const userTypes = {
  EMPLOYEE: "employee",
  ADMIN: "admin",
};

const orderTypes = {
  DINE_IN: "dineIn",
  TAKE_AWAY: "takeAway",
  DELIVERY: "delivery",
};

const employeesRoles = {
  CHEF: "Chef",
  WAITER: "Waiter",
  DELIVERY_BOY: "Delivery Boy",
};

const Dialog_Boxes = {
  showAcceptConfirmation: (id, handleAccept) => {
    Swal.fire({
      title: "Accept Order?",
      text: "Complete the order to get more order offers",
      icon: "success",
      confirmButtonColor: "skyblue",
      confirmButtonText: "Ok",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleAccept(id);
    });
  },
  showStatusChangeConfirm: (id, status, handleUpdateStatus) => {
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
  },

  showCancelConfirmation: (id, handleCancel) => {
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
  },
  showRejectConfirmation: (id, handleReject) => {
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
  },
  showOrderCompleted: () => {
    Swal.fire({
      title: "Order Completed",
      text: "You can earn more, get more orders",
      icon: "success",
      confirmButtonColor: "skyblue",
    });
  },
  showCustomAlert: (title, text, position = "center", handleFunction) => {
    setTimeout(() => {
      Swal.fire({
        title,
        text,
        icon: "question",
        confirmButtonColor: "green",
        confirmButtonText: "Ok",
        showCancelButton: true,
        position,
      }).then((result) => {
        if (result.isConfirmed) handleFunction();
      });
    }, 300);
  },
};

export { statuses, orderTypes, Dialog_Boxes, userTypes, employeesRoles };
