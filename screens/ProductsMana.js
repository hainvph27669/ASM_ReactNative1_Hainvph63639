import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { ProductContext } from '../screens/ProductContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../API/ApiServer';

const ProductsMana = () => {
  const { products, fetchProducts } = useContext(ProductContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    brand: '',
    image: '',
    sizes: '',
    colors: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý thêm/sửa sản phẩm
  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.price) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm');
      return;
    }
    const data = {
      ...currentProduct,
      price: Number(currentProduct.price),
      sizes: currentProduct.sizes ? currentProduct.sizes.split(',').map(s => s.trim()) : [],
      colors: currentProduct.colors ? currentProduct.colors.split(',').map(c => c.trim()) : [],
    };
    if (editMode) {
      await updateProduct(currentProduct.id, data);
      Alert.alert('Thành công', 'Sửa sản phẩm thành công!');
    } else {
      await addProduct(data);
      Alert.alert('Thành công', 'Thêm sản phẩm thành công!');
    }
    setModalVisible(false);
    setCurrentProduct({ name: '', price: '', brand: '', image: '', sizes: '', colors: '' });
    setEditMode(false);
    await fetchProducts();
  };

  // Xử lý xoá sản phẩm
  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá sản phẩm này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          Alert.alert('Thành công', 'Xoá sản phẩm thành công!');
          await fetchProducts();
        }
      }
    ]);
  };

  // Mở modal sửa
  const handleEdit = (item) => {
    setCurrentProduct({
      ...item,
      price: item.price?.toString() || '',
      sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : '',
      colors: Array.isArray(item.colors) ? item.colors.join(', ') : '',
    });
    setEditMode(true);
    setModalVisible(true);
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setCurrentProduct({ name: '', price: '', brand: '', image: '', sizes: '', colors: '' });
    setEditMode(false);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>Giá: {Number(item.price).toLocaleString('vi-VN')}₫</Text>
      <Text>Hãng: {item.brand}</Text>
      <Text>Size: {Array.isArray(item.sizes) ? item.sizes.join(', ') : ''}</Text>
      <Text>Màu: {Array.isArray(item.colors) ? item.colors.join(', ') : ''}</Text>
      <View style={styles.row}>
        <Button title="Sửa" onPress={() => handleEdit(item)} />
        <Button title="Xoá" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Thêm sản phẩm" onPress={handleAdd} />
      <FlatList
        data={products}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{editMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={currentProduct.name}
                onChangeText={text => setCurrentProduct({ ...currentProduct, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Giá"
                value={currentProduct.price}
                keyboardType="numeric"
                onChangeText={text => setCurrentProduct({ ...currentProduct, price: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Hãng"
                value={currentProduct.brand}
                onChangeText={text => setCurrentProduct({ ...currentProduct, brand: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Link ảnh"
                value={currentProduct.image}
                onChangeText={text => setCurrentProduct({ ...currentProduct, image: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Size (cách nhau bằng dấu phẩy)"
                value={currentProduct.sizes}
                onChangeText={text => setCurrentProduct({ ...currentProduct, sizes: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Màu (cách nhau bằng dấu phẩy)"
                value={currentProduct.colors}
                onChangeText={text => setCurrentProduct({ ...currentProduct, colors: text })}
              />
              <View style={styles.row}>
                <Button title="Lưu" onPress={handleSave} />
                <Button title="Huỷ" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProductsMana;
