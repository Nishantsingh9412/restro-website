const initialState = {
  items: [],
  length: 0,
  total: 0,
};

const OrderItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ORDER_ITEM_TEMP": {
      const existingItem = state.items.find(
        (item) => item._id === action.data._id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item._id === action.data._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          length: state.length + 1,
          total: state.total + existingItem.priceVal,
        };
      } else {
        const newItem = { ...action.data, quantity: 1 };
        return {
          ...state,
          items: [...state.items, newItem],
          length: state.length + 1,
          total: state.total + newItem.priceVal,
        };
      }
    }
    case "UPDATE_ORDER_ITEM_TEMP_SUBITEM": {
      const { parentId, subItems } = action.data;
      const updatedItems = state.items.map((item) => {
        if (item._id === parentId) {
          return { ...item, selectedSubItems: subItems };
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems,
      };
    }
    case "REMOVE_ORDER_ITEM_TEMP": {
      const existingItem = state.items.find((item) => item._id === action.data);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          const updatedItems = state.items.map((item) =>
            item._id === action.data
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          return {
            ...state,
            items: updatedItems,
            length: state.length - 1,
            total: state.total - existingItem.priceVal,
          };
        } else {
          const updatedItems = state.items.filter(
            (item) => item._id !== action.data
          );
          return {
            ...state,
            items: updatedItems,
            length: state.length - 1,
            total: state.total - existingItem.priceVal,
          };
        }
      }
      return state;
    }
    case "REMOVE_ORDER_ITEM_TEMP_COMPLETELY": {
      const existingItem = state.items.find((item) => item._id === action.data);
      if (existingItem) {
        const updatedItems = state.items.filter(
          (item) => item._id !== action.data
        );
        return {
          ...state,
          items: updatedItems,
          length: state.length - existingItem.quantity,
          total: state.total - existingItem.quantity * existingItem.priceVal,
        };
      }
      return state;
    }
    case "RESET_ORDER_ITEM_TEMP": {
      return initialState;
    }
    default:
      return state;
  }
};

export default OrderItemReducer;
