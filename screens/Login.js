import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { loginUser } from '../API/ApiServer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);

  // Khi mở màn hình, nếu đã lưu thì tự động điền lại
  useEffect(() => {
    const loadRemembered = async () => {
      const saved = await AsyncStorage.getItem('remembered');
      if (saved) {
        const { username, password } = JSON.parse(saved);
        setUsername(username);
        setPassword(password);
        setRemember(true);
      }
    };
    loadRemembered();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Tên đăng nhập không được bỏ trống';
    } else if (username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!password) {
      newErrors.password = 'Mật khẩu không được bỏ trống';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const result = await loginUser({ username, password });
        if (result) {
          // Lưu user vào AsyncStorage để Account.js lấy ra
          await AsyncStorage.setItem('user', JSON.stringify(result));
          if (remember) {
            await AsyncStorage.setItem('remembered', JSON.stringify({ username, password }));
          } else {
            await AsyncStorage.removeItem('remembered');
          }
          Alert.alert('Đăng nhập thành công', `Xin chào, ${username}!`);
          navigation.replace('HomeTabs');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập');
      }
    }
  };

  const handleFacebookLogin = () => {
    Alert.alert('Đăng nhập Facebook', 'Chức năng đăng nhập Facebook chưa được triển khai.');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Đăng nhập Google', 'Chức năng đăng nhập Google chưa được triển khai.');
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={{ uri: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D' }}
        style={styles.logo}
        resizeMode="contain"
      /> */}
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Checkbox ghi nhớ tài khoản */}
      <TouchableOpacity
        style={styles.rememberRow}
        onPress={() => setRemember(!remember)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
          {remember && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
        <Text style={styles.rememberText}>Ghi nhớ tài khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={handleFacebookLogin}>
        <Text style={styles.socialButtonText}>Đăng nhập bằng Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleLogin}>
        <Text style={styles.socialButtonText}>Đăng nhập bằng Google</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  socialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 15,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#1e90ff',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#1e90ff',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rememberText: {
    fontSize: 15,
    color: '#333',
  },
});

export default Login;
