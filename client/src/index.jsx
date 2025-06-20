import "./styles.css";
import "./assets/css/toast.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import React, { lazy, Suspense } from "react";
import { ToastProvider } from "./contexts/ToastContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import SocketInitializer from "./contexts/SocketInitialiser";
import NotFoundPage from "./components/NotFoundPage/NotFound";
import AppInitializer from "./initializer/AppInitializer";

//TODO:Will Be removed
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import { ChakraProvider } from "@chakra-ui/react";
// import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";

// Lazy load heavy components
const SignUp = lazy(() => import("./views/auth/signup"));
const SignIn = lazy(() => import("./views/auth/signIn"));
const AdminLayout = lazy(() => import("./layouts/admin"));
const EmployeeLayout = lazy(() => import("./layouts/employee"));
const ForgotPassword = lazy(() => import("./views/auth/forgotPassword"));

import {
  adminRoutes,
  chefRoutes,
  staffRoutes,
  waiterRoutes,
  helperRoutes,
  managerRoutes,
  deliveryRoutes,
  bartenderRoutes,
} from "./routes";

// Render routes dynamically
const renderRoutes = (routes) =>
  routes.map((route, index) =>
    route.links
      ? route.links.map((nestedRoute, nestedIndex) => (
          <Route
            key={nestedIndex}
            path={nestedRoute.path.replace(/^\//, "")}
            element={
              <Suspense fallback={null}>{nestedRoute.component}</Suspense>
            }
          />
        ))
      : route.component && (
          <Route
            key={index}
            path={route.path.replace(/^\//, "")}
            element={<Suspense fallback={null}>{route.component}</Suspense>}
          />
        )
  );

// Root of the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <SocketInitializer />
        <ToastProvider>
          {/* <ThemeEditorProvider> */}
          <Router>
            <AppInitializer />
            <Suspense fallback={null}>
              <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<SignIn />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
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
            </Suspense>
            <ToastContainer style={{ zIndex: 99999 }} newestOnTop />
          </Router>
          {/* </ThemeEditorProvider> */}
        </ToastProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
