import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.gradient}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=800&auto=format&fit=crop&q=80' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Chào mừng bạn đến với{"\n"}<Text style={styles.brand}>SHOP GIÀY THỂ THAO CHÍNH H</Text>!</Text>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 32 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #1e90ff 0%, #6dd5ed 100%)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 36,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#1e90ff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: '#1e90ff99',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brand: {
    color: '#ffd700',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Splash;