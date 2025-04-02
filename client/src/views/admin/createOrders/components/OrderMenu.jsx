import { useState } from "react";

const OrderMenu = () => {
  const [cart, setCart] = useState([]);
  const menu = {
    Appetizers: [
      { id: 1, name: "Spring Rolls", price: 5 },
      { id: 2, name: "Garlic Bread", price: 4 },
    ],
    MainCourse: [
      { id: 3, name: "Grilled Chicken", price: 12 },
      { id: 4, name: "Pasta Alfredo", price: 10 },
    ],
    Desserts: [
      { id: 5, name: "Cheesecake", price: 6 },
      { id: 6, name: "Brownie", price: 5 },
    ],
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div>
      <h1>Order Menu</h1>
      {Object.keys(menu).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {menu[category].map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}{" "}
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2>Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderMenu;
