import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://192.168.137.150:3000/users';

const Account = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        console.log('USER FROM STORAGE:', userStr);
        if (userStr) {
          const userObj = JSON.parse(userStr);
          const res = await axios.get(`${API_URL}/${userObj.id}`);
          setUser(res.data);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản');
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Không có thông tin tài khoản</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Icon name="person-circle-outline" size={100} color="#1e90ff" />
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.infoBox}>
        <InfoRow label="Email" value={user.email} icon="mail-outline" />
        {/* Thêm các trường khác nếu có */}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.row}>
    <Icon name={icon} size={22} color="#1e90ff" style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || 'Chưa cập nhật'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    width: 110,
  },
  value: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
});

export default Account;
