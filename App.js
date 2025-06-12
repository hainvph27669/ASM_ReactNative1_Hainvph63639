import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home'; // Tab bottom chỉ có Trang chủ
import ProductDetails from './screens/ProductDetails';
import ShoppingCart from './screens/ShoppingCart';
import Account from './screens/Account';
import Login from './screens/Login';
import Register from './screens/Register';
import Splash from './screens/Splash'; // Thêm dòng này
import { ProductProvider } from './screens/ProductContext';
import Pay from './screens/Pay';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ title: 'Đăng Nhập', headerShown: true }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Đăng Ký', headerShown: true }} />
          <Stack.Screen name="HomeTabs" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Chi Tiết Sản Phẩm', headerShown: true }} />
          <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{ title: 'Giỏ hàng', headerShown: true }} />
          <Stack.Screen name="Account" component={Account} options={{ title: 'Tài khoản', headerShown: true }} />
          <Stack.Screen name="Pay" component={Pay} options={{ title: 'Thanh Toán', headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}
