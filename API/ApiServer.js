// API/ApiServer.js
import axios from 'axios';
import { Alert } from 'react-native';


const apiUrl = 'http://192.168.1.148:3000/products';
const cartApiUrl = 'http://192.168.1.148:3000/produtcsCart';
const authApiUrl = 'http://192.168.1.148:3000/users';

// Hàm lấy danh sách sản phẩm
export const getProducts = async () => {
  try {
    const res = await axios.get(apiUrl);
    return res.data; // Trả về mảng sản phẩm
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ');
    return []; // Trả về mảng rỗng khi lỗi
  }
};

// Hàm lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/${id}`);
    return res.data; // Trả về sản phẩm theo ID
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ');
    return null; // Trả về null khi lỗi
  }
};

// Thêm sản phẩm mới
export const addProduct = async (product) => {
  try {
    const res = await axios.post(apiUrl, product);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error.message);
    Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
    return null;
  }
};

// Sửa sản phẩm
export const updateProduct = async (id, updatedProduct) => {
  try {
    const res = await axios.put(`${apiUrl}/${id}`, updatedProduct);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi sửa sản phẩm:', error.message);
    Alert.alert('Lỗi', 'Không thể sửa sản phẩm');
    return null;
  }
};

// Xoá sản phẩm
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm:', error.message);
    Alert.alert('Lỗi', 'Không thể xoá sản phẩm');
    return false;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cartItem) => {
  try {
    const res = await axios.post(cartApiUrl, cartItem);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error.message);
    Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
    return null;
  }
};

// Lấy danh sách giỏ hàng
export const getCart = async () => {
  try {
    const res = await axios.get(cartApiUrl);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error.message);
    Alert.alert('Lỗi', 'Không thể lấy dữ liệu giỏ hàng');
    return [];
  }
};

// Sửa sản phẩm trong giỏ hàng
export const updateCartItem = async (id, updatedItem) => {
  try {
    const res = await axios.put(`${cartApiUrl}/${id}`, updatedItem);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error.message);
    Alert.alert('Lỗi', 'Không thể cập nhật giỏ hàng');
    return null;
  }
};

// Xoá sản phẩm khỏi giỏ hàng
export const deleteCartItem = async (id) => {
  try {
    await axios.delete(`${cartApiUrl}/${id}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi xoá khỏi giỏ hàng:', error.message);
    Alert.alert('Lỗi', 'Không thể xoá khỏi giỏ hàng');
    return false;
  }
};

// Đăng ký tài khoản mới
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(authApiUrl, userData); // <-- Sửa lại endpoint
    return res.data;
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.message);
    Alert.alert('Lỗi', 'Không thể đăng ký tài khoản');
    return null;
  }
};

// Đăng nhập 
export const loginUser = async (loginData) => {
  try {
    const res = await axios.get(
      `${authApiUrl}?username=${loginData.username}&password=${loginData.password}`
    );
    if (res.data && res.data.length > 0) {
      return res.data[0]; // Đăng nhập thành công
    } else {
      Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);
    Alert.alert('Lỗi', 'Không thể đăng nhập');
    return null;
  }
};

