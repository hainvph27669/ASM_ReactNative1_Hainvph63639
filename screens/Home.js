import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { getProducts } from '../API/ApiServer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ShoppingCart from './ShoppingCart'; // Thêm dòng này ở đầu file
import Account from './Account';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.46;

// Các màn hình khác cho thanh điều hướng dưới
const AccountScreen = () => (
  <View style={styles.centered}><Text>Tài khoản</Text></View>
);
const SettingsScreen = () => (
  <View style={styles.centered}><Text>Cài đặt</Text></View>
);

const bannerImages = [
  'https://plus.unsplash.com/premium_photo-1722168023154-289e8a536ab1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnMlMjBiYW5uZXJ8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNuZWFrZXJzfGVufDB8fDB8fHww',
];

const MainProductScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  // Tự động chuyển banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % bannerImages.length);
    }, 3000); // 3 giây đổi ảnh
    return () => clearInterval(interval);
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Image
        source={{
          uri: item.image && item.image.trim() !== ''
            ? item.image
            : 'https://reactnative.dev/img/tiny_logo.png'
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString('vi-VN')}₫
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>
            Size: {Array.isArray(item.sizes) ? item.sizes.join(', ') : 'N/A'}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>
            Màu: {Array.isArray(item.colors) ? item.colors.join(', ') : 'N/A'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('ProductDetails', { productId: item.id })
          }

        >
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>

        
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Giày Thể Thao Chính Hãng</Text>
      <Image
        source={{ uri: bannerImages[bannerIndex] }}
        style={styles.banner}
        resizeMode="cover"
      />
      
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 12 }}
      />
    </SafeAreaView>
  );
};

// Tạo Bottom Tab
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={MainProductScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={ShoppingCart} // Đổi từ CartScreen sang ShoppingCart
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cài đặt"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  banner: {
    width: '100%',
    height: 180,
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    paddingLeft: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  brand: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e91e63',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  detail: {
    fontSize: 12,
    color: '#555',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
