import PropTypes from "prop-types";

const ActiveOrder = ({ order }) => {
  return (
    <div className="active-order">
      <h2>Active Order</h2>
      <p>Order ID: {order.id}</p>
      <p>Table Number: {order.tableNumber}</p>
      <p>Status: {order.status}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};
ActiveOrder.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tableNumber: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ActiveOrder;
