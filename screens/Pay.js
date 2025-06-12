import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const Pay = ({ route, navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Lấy đơn hàng từ params, nếu không có thì là mảng rỗng
  const order = route?.params?.order || [];

  const totalPrice = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirm = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }

    Alert.alert(
      'Xác nhận',
      `Cảm ơn ${fullName}!\nĐơn hàng của bạn đã được tiếp nhận.\nTổng tiền: ${totalPrice.toLocaleString('vi-VN')}₫`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomeTabs'),
        },
      ]
    );
    // Xử lý gửi đơn hàng đến backend tại đây
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemDetail}>
          Màu: {item.color} | Size: {item.size}
        </Text>
      </View>
      <Text style={styles.itemQty}>x{item.quantity}</Text>
      <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Thông tin giao hàng</Text>

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={styles.header}>Đơn hàng của bạn</Text>
        <FlatList
          data={order}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalValue}>{totalPrice.toLocaleString('vi-VN')}₫</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  itemDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    marginBottom: 2,
  },
  itemQty: {
    width: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  itemPrice: {
    width: 100,
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff3b30',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default Pay;
