import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import DeliveryLayout from "layouts/delivery";
// import MainPage from './MainPage.jsx'
import SignIn from "views/auth/signIn";
import RtlLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
// Redux dependencies and store
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

import Reducers from "./redux/reducers/index";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min.js";
import SocketInitializer from "contexts/SocketInitialiser";
import { ToastContainer } from "react-toastify";

const store = createStore(
  Reducers,
  compose(
    applyMiddleware(thunk) // middleware
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()  // store enhancers
  )
);

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <React.StrictMode>
          <SocketInitializer />
          <ToastContainer />
          <ThemeEditorProvider>
            <BrowserRouter>
              <Switch>
                <Route path={`/auth`} component={AuthLayout} />
                <Route path={`/admin`} component={AdminLayout} />
                <Route path={"/delivery"} component={DeliveryLayout} />
                <Route path={`/rtl`} component={RtlLayout} />
                <Route path={"/"} component={SignIn} />
              </Switch>
            </BrowserRouter>
          </ThemeEditorProvider>
        </React.StrictMode>
      </Provider>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
