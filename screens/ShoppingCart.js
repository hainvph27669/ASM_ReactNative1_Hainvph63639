import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Thêm dòng này
import { getCart, updateCartItem, deleteCartItem } from '../API/ApiServer';

const ShoppingCart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sử dụng useFocusEffect để giữ trạng thái khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      fetchCart();
      // Không reset state khi unmount
    }, [])
  );

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      try {
        await updateCartItem(id, updatedItem);
        setCartItems(prev =>
          prev.map(i => (i.id === id ? updatedItem : i))
        );
      } catch {
        Alert.alert('Lỗi', 'Không thể tăng số lượng');
      }
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      if (item.quantity > 1) {
        const updatedItem = { ...item, quantity: item.quantity - 1 };
        try {
          await updateCartItem(id, updatedItem);
          setCartItems(prev =>
            prev.map(i => (i.id === id ? updatedItem : i))
          );
        } catch {
          Alert.alert('Lỗi', 'Không thể giảm số lượng');
        }
      } else {
        // Không cho giảm về 0, chỉ cảnh báo hoặc không làm gì
        Alert.alert('Thông báo', 'Số lượng tối thiểu là 1');
      }
    }
  };

  const removeItem = (id) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn xóa sản phẩm khỏi giỏ?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCartItem(id);
              setCartItems(prev => prev.filter(i => i.id !== id));
            } catch {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          },
        },
      ]
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.detail}>Màu: {item.color} | Size: {item.size}</Text>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}₫</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQuantity(item.id)}>
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQuantity(item.id)}>
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Tổng tiền: {totalPrice.toLocaleString('vi-VN')}₫
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                navigation.navigate('Pay', { order: cartItems })
              }
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  image: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  detail: { fontSize: 13, color: '#555', marginVertical: 2 },
  price: { fontSize: 14, color: '#ff3b30', marginVertical: 6 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    marginTop: 10,
  },
});

export default ShoppingCart;
