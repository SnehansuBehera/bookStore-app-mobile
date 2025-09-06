import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/login-styles'
import COLORS from '../../constants/color.js'
import { useAuthStore } from '../../store/authStore.js'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {isLoading, login} = useAuthStore()
    const handleLogin = async() => { 
        const result = await login(email, password);
        if(!result.success){
            Alert.alert("Error", result.err || "Login failed");
        }
           setEmail('');
         setPassword('');  
    }
    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS==='ios'?'padding':'height'}
    >
        <View style={styles.container}>
           <View>
              <Image
                  source={require('../../assets/images/login-ills.png')}
                  style={styles.illustrationImage}
                  contentFit="contain"
              />
            </View>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email</Text>
                      <View style={styles.inputContainer}>
                          <Ionicons
                              name='mail-outline'
                              size={20}
                              color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          <TextInput
                              style={styles.input}
                              placeholder='Enter your email'
                              placeholderTextColor={COLORS.placeholderText}
                              value={email}
                              onChangeText={setEmail}
                              keyboardType='email-address'
                                autoCapitalize='none'
                          />
                      </View>
                  </View>
                  <View style={styles.inputGroup}>
                      <Text style={styles.label}>Password</Text>
                      <View style={styles.inputContainer}>
                          <Ionicons
                              name='lock-closed-outline'
                              size={20}
                              color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          <TextInput
                              style={styles.input}
                              placeholder='Enter your password'
                              placeholderTextColor={COLORS.placeholderText}
                              value={password}
                              onChangeText={setPassword}
                              secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              style={styles.eyeIcon}
                          >
                               <Ionicons
                              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                              size={20}
                                color={COLORS.primary}
                          />
                          </TouchableOpacity>
                         
                      </View>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                      {isLoading ? (
                          <ActivityIndicator color="#fff" />) : (
                            <Text style={styles.buttonText}>Login</Text>
                    )}                    
                  </TouchableOpacity>
                  <View style={styles.footer}>
                      <Text style={styles.footerText}>Don&apos;t have an account?</Text>
                      <Link href='/signup' asChild>
                          <TouchableOpacity>
                              <Text style={styles.link}>Sign up</Text>
                        </TouchableOpacity>
                      </Link>
                  </View>
              </View>
            </View>
        </View>
    </KeyboardAvoidingView>
  )
}