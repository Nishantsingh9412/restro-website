/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import "./assets/css/toast.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import theme from "./theme/theme";
import store from "./redux/store";
import SocketInitializer from "./contexts/SocketInitialiser";
import { ToastProvider } from "./contexts/ToastContext";

// Lazy load heavy components
const AdminLayout = lazy(() => import("./layouts/admin"));
const EmployeeLayout = lazy(() => import("./layouts/employee"));
const SignIn = lazy(() => import("./views/auth/signIn"));
const SignUp = lazy(() => import("./views/auth/signup"));
const ForgotPassword = lazy(() => import("./views/auth/forgotPassword"));

// adminRoutes,
import adminRoutes, {
  staffRoutes,
  deliveryRoutes,
  waiterRoutes,
  managerRoutes,
  helperRoutes,
  bartenderRoutes,
  chefRoutes,
} from "./routes";
import NotFound from "./components/NotFoundPage/NotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));

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

root.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <ToastProvider>
          <SocketInitializer />
          <ThemeEditorProvider>
            <Router>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="*" element={<NotFound />} />
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
          </ThemeEditorProvider>
        </ToastProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
