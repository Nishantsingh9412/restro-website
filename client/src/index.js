import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
// Redux dependencies and store
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';

import Reducers from './redux/reducers/index';


const store = createStore(
	Reducers, 
	compose(
		applyMiddleware(thunk),			// middleware
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()  // store enhancers
	)
);

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<Provider store={store}>
			<React.StrictMode>
				<ThemeEditorProvider>
					<HashRouter>
						<Switch>
							<Route path={`/auth`} component={AuthLayout} />
							<Route path={`/admin`} component={AdminLayout} />
							<Route path={`/rtl`} component={RtlLayout} />
							<Redirect from='/' to='/admin' />
						</Switch>
					</HashRouter>
				</ThemeEditorProvider>
			</React.StrictMode>
		</Provider>
	</ChakraProvider>,
	document.getElementById('root')
);
