import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Updated import
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import SignIn from "./views/auth/signIn";
import RtlLayout from "./layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import { compose, applyMiddleware, createStore } from "redux";
import Reducers from "./redux/reducers/index";
import routes from "./routes";

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
              <Route path="/auth/*" element={<AuthLayout />} /> {/* Use '/*' for nested routes */}
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/rtl/*" element={<RtlLayout />} />
              <Route path="/" element={<SignIn />} />
              {/* Uncomment to redirect from root to /admin */}
              {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
            </Routes>
          </Router>
        </ThemeEditorProvider>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>
);
