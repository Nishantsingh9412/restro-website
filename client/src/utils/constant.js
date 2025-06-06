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

export const employeePermissions = [
  { id: 1, label: "Inventory Management" },
  { id: 2, label: "Employee Management" },
  { id: 3, label: "Food And Drinks" },
  { id: 4, label: "Delivery Tracking" },
];

export const actionTypes = {
  ADD: "add",
  EDIT: "edit",
  VIEW: "view",
  DELETE: "delete",
  CANCEL: "cancel",
  REJECT: "reject",
  ACCEPT: "accept",
  UPDATE: "update",
  COMPLETE: "complete",
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

const orderMethods = {
  INDIVIDUAL: "individual",
  TOGETHER: "together",
};

const guestTypes = {
  DEFAULT: "default",
  GUEST: "guest",
};

const employeesRoles = {
  CHEF: "Chef",
  WAITER: "Waiter",
  DELIVERY_BOY: "Delivery Boy",
  MANAGER: "Manager",
  KITCHEN_STAFF: "Kitchen Staff",
  BAR_TENDER: "Bar Tender",
  CUSTOM: "Custom",
};

const localStorageData = {
  PROFILE_DATA: "ProfileData",
};

const addressTypes = {
  MAP: "map",
  MANUAL: "manual",
};

export const COLOR_SCALE = [
  { threshold: 0, color: "#ebedf0" },
  { threshold: 50, color: "#c6e48b" },
  { threshold: 100, color: "#7bc96f" },
  { threshold: 200, color: "#239a3b" },
  { threshold: Infinity, color: "#196127" },
];

export const USER_STATUS = { ONLINE: "online", OFFLINE: "offline" };

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
  showDeleteConfirmation: (handleDelete) => {
    Swal.fire({
      title: "Delete Item?",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleDelete();
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

export {
  statuses,
  orderTypes,
  Dialog_Boxes,
  userTypes,
  employeesRoles,
  addressTypes,
  orderMethods,
  guestTypes,
  localStorageData,
};
