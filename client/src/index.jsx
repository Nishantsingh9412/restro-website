import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import RtlLayout from "./layouts/rtl";
import SignIn from "./views/auth/signIn";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import { compose, applyMiddleware, createStore } from "redux";
import Reducers from "./redux/reducers/index";
import routes2 from "./routes";
import SignUp from "./views/auth/signup";

const store = createStore(
  Reducers,
  compose(
    applyMiddleware(thunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Uncomment for Redux DevTools
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
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

              {/* Admin Layout Routes */}
              <Route path="/admin/*" element={<AdminLayout />}>
                {routes2.map((route, index) => {
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
            </Routes>
          </Router>
        </ThemeEditorProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
