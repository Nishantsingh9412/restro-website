import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import DeliveryLayout from "./layouts/delivery";
import EmployeeLayout from "./layouts/employee";
import RtlLayout from "./layouts/rtl";
import SignIn from "./views/auth/signIn";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import adminRoutes from "./routes";
import { deliveryRoutes, waiterRoutes } from "./routes";
import SignUp from "./views/auth/signup";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";

// Create root element for React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application
root.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <ThemeEditorProvider>
          <Router>
            <Routes>
              {/* Fallback route for unmatched paths */}
              <Route path="*" element={<h1>NOT FOUND</h1>} />

              {/* Authentication layout routes */}
              <Route path="/auth/*" element={<AuthLayout />} />

              {/* RTL layout routes */}
              <Route path="/rtl/*" element={<RtlLayout />} />

              {/* Default route to SignIn component */}
              <Route path="/" element={<SignIn />} />

              {/* SignUp route */}
              <Route path="/auth/sign-up" element={<SignUp />} />

              {/* Admin Layout Routes */}
              <Route path="/admin/*" element={<AdminLayout />}>
                {adminRoutes.map((route, index) => {
                  // Render main component if it exists
                  if (route.component && !route.links) {
                    return (
                      <Route
                        key={index}
                        path={route.path.replace(/^\//, "")} // Remove leading '/'
                        element={route.component}
                      />
                    );
                  }
                  // If the route has nested links, render them
                  if (route.links) {
                    return route.links.map((nestedRoute, nestedIndex) => (
                      <Route
                        key={nestedIndex}
                        path={nestedRoute.path.replace(/^\//, "")} // Remove leading '/'
                        element={nestedRoute.component}
                      />
                    ));
                  }
                  return null; // If no valid route exists
                })}
              </Route>
              {/* Uncomment to redirect from root to /admin */}
              {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}

              <Route path="/delivery/*" element={<DeliveryLayout />}>
                {/* Delivery layout routes */}
                {deliveryRoutes.map((route, index) => {
                  // Render main component if it exists
                  if (route.component && !route.links) {
                    return (
                      <Route
                        key={index}
                        path={route.path.replace(/^\//, "")} // Remove leading '/'
                        element={route.component}
                      />
                    );
                  }
                  // If the route has nested links, render them
                  if (route.links) {
                    return route.links.map((nestedRoute, nestedIndex) => (
                      <Route
                        key={nestedIndex}
                        path={nestedRoute.path.replace(/^\//, "")} // Remove leading '/'
                        element={nestedRoute.component}
                      />
                    ));
                  }
                  return null; // If no valid route exists
                })}
              </Route>
              <Route path="/waiter/*" element={<EmployeeLayout />}>
                {/* Waiter layout routes */}
                {waiterRoutes.map((route, index) => {
                  // Render main component if it exists
                  if (route.component && !route.links) {
                    return (
                      <Route
                        key={index}
                        path={route.path.replace(/^\//, "")} // Remove leading '/'
                        element={route.component}
                      />
                    );
                  }
                  // If the route has nested links, render them
                  if (route.links) {
                    return route.links.map((nestedRoute, nestedIndex) => (
                      <Route
                        key={nestedIndex}
                        path={nestedRoute.path.replace(/^\//, "")} // Remove leading '/'
                        element={nestedRoute.component}
                      />
                    ));
                  }
                  return null; // If no valid route exists
                })}
              </Route>
            </Routes>
            {/* Toast notifications container */}
            <ToastContainer style={{ zIndex: 99999 }} newestOnTop={true} />
          </Router>
        </ThemeEditorProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
