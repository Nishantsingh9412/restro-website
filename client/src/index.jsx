import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import theme from "./theme/theme";
import store from "./redux/store";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import DeliveryLayout from "./layouts/delivery";
import EmployeeLayout from "./layouts/employee";
import RtlLayout from "./layouts/rtl";
import SignIn from "./views/auth/signIn";
import SignUp from "./views/auth/signup";
import adminRoutes, {
  staffRoutes,
  deliveryRoutes,
  waiterRoutes,
  managerRoutes,
  helperRoutes,
  bartenderRoutes,
  chefRoutes,
} from "./routes";
import {} from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderRoutes = (routes) =>
  routes.map((route, index) =>
    route.links
      ? route.links.map((nestedRoute, nestedIndex) => (
          <Route
            key={nestedIndex}
            path={nestedRoute.path.replace(/^\//, "")}
            element={nestedRoute.component}
          />
        ))
      : route.component && (
          <Route
            key={index}
            path={route.path.replace(/^\//, "")}
            element={route.component}
          />
        )
  );

root.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <ThemeEditorProvider>
          <Router>
            <Routes>
              <Route path="*" element={<h1>NOT FOUND</h1>} />
              <Route path="/auth/*" element={<AuthLayout />} />
              <Route path="/rtl/*" element={<RtlLayout />} />
              <Route path="/" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/admin/*" element={<AdminLayout />}>
                {renderRoutes(adminRoutes)}
              </Route>
              <Route path="/employee/*" element={<EmployeeLayout />}>
                {renderRoutes(deliveryRoutes)}
                {renderRoutes(waiterRoutes)}
                {renderRoutes(chefRoutes)}
                {renderRoutes(managerRoutes)}
                {renderRoutes(staffRoutes)}
                {renderRoutes(helperRoutes)}
                {renderRoutes(bartenderRoutes)}
              </Route>
            </Routes>
            <ToastContainer style={{ zIndex: 99999 }} newestOnTop />
          </Router>
        </ThemeEditorProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
