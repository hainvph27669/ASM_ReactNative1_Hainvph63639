import { registerRootComponent } from 'expo';

import App from './App';
import ForgotPassword from './Login_Register/ForgotPassWord';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails';
import ShoppingCart from './screens/ShoppingCart';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
