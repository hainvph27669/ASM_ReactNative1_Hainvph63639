import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { addToCart } from '../API/ApiServer'; // Thêm dòng này ở đầu file

const apiUrl = 'http://192.168.1.148:3000/products'

const { width } = Dimensions.get('window');

const ProductDetails = ({ route, navigation }) => {
  const { productId } = route.params; 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Thêm state cho size và màu đã chọn
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    // hàm lấy data chi tiết sản phẩm
    const fetchProductDetail = async () => {
      try {
        const res = await axios.get(`http://192.168.1.148:3000/products/${productId}`); 
        setProduct(res.data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không có dữ liệu sản phẩm</Text>
      </View>
    );
  }

  // Hàm xử lý khi bấm nút thêm vào giỏ
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Thông báo', 'Vui lòng chọn size và màu sắc!');
      return;
    }
    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    };
    const result = await addToCart(cartItem);
    if (result) {
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomeTabs')
        }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{Number(product.price).toLocaleString('vi-VN')}₫</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Hiển thị chọn size */}
        <Text style={{ marginTop: 18, fontWeight: 'bold' }}>Chọn size:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
          {product.sizes && product.sizes.map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                selectedSize === size && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.optionText,
                selectedSize === size && styles.optionTextSelected
              ]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hiển thị chọn màu */}
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Chọn màu sắc:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
          {product.colors && product.colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.optionButton,
                selectedColor === color && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Text style={[
                styles.optionText,
                selectedColor === color && styles.optionTextSelected
              ]}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Thêm style cho nút chọn size/màu
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: width,
    backgroundColor: '#f7f7f7',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#ff3b30',
    fontWeight: '700',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  optionText: {
    color: '#333',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
