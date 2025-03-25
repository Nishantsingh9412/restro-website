const initialState = {
  items: [],
  length: 0,
  total: 0,
};

const calculateItemTotal = (item) => {
  const totalPrice =
    item.priceVal +
    (item.selectedSubItems || item.subItems || []).reduce(
      (acc, subItem) => acc + subItem.price,
      0
    );
  return item.quantity * totalPrice;
};

const OrderItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ORDER_ITEM_TEMP": {
      const existingItem = state.items.find(
        (item) => item._id === action.data._id
      );
      const newItem = existingItem
        ? {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          }
        : { ...action.data, quantity: 1 };

      const updatedItems = existingItem
        ? state.items.map((item) =>
            item._id === action.data._id ? newItem : item
          )
        : [...state.items, newItem];

      return {
        ...state,
        items: updatedItems,
        length: state.length + 1,
        total: updatedItems.reduce(
          (acc, item) => acc + calculateItemTotal(item),
          0
        ),
      };
    }
    case "UPDATE_ORDER_ITEM_TEMP_SUBITEM": {
      const { parentId, subItems } = action.data;
      const updatedItems = state.items.map((item) =>
        item._id === parentId ? { ...item, selectedSubItems: subItems } : item
      );

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (acc, item) => acc + calculateItemTotal(item),
          0
        ),
      };
    }
    case "REMOVE_ORDER_ITEM_TEMP": {
      const existingItem = state.items.find((item) => item._id === action.data);
      if (!existingItem) return state;

      const updatedItems =
        existingItem.quantity > 1
          ? state.items.map((item) =>
              item._id === action.data
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          : state.items.filter((item) => item._id !== action.data);

      return {
        ...state,
        items: updatedItems,
        length: state.length - 1,
        total: updatedItems.reduce(
          (acc, item) => acc + calculateItemTotal(item),
          0
        ),
      };
    }
    case "REMOVE_ORDER_ITEM_TEMP_COMPLETELY": {
      const updatedItems = state.items.filter(
        (item) => item._id !== action.data
      );

      return {
        ...state,
        items: updatedItems,
        length: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
        total: updatedItems.reduce(
          (acc, item) => acc + calculateItemTotal(item),
          0
        ),
      };
    }
    case "RESET_ORDER_ITEM_TEMP":
      return initialState;

    default:
      return state;
  }
};

export default OrderItemReducer;
