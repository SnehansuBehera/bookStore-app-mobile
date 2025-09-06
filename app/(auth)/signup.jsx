import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/login-styles'
import COLORS from '../../constants/color.js'
import { useAuthStore } from '../../store/authStore.js'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  
  const { user, isLoading, register, token } = useAuthStore();
  const router = useRouter();

  const handRegister = async () => { 
    const result = await register(username, email, password);
    if(!result.success){
      Alert.alert("Error", result.err || "Registration failed");
    }
    setEmail('');
    setPassword('');  
    setUsername('');
  }



  return (
    <KeyboardAvoidingView style={{
      flex: 1
    }} behavior={Platform.OS === 'ios' ? 'padding' : ''}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm</Text>
            <Text style={styles.subtitle}>Share your favourite reads</Text>
              </View>
              <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                      <Text style={styles.label}>Username</Text>
                      <View style={styles.inputContainer}>
                          <Ionicons
                              name='person-outline'
                              size={20}
                              color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          <TextInput
                              style={styles.input}
                              placeholder='JohnDoe'
                              placeholderTextColor={COLORS.placeholderText}
                              value={username}
                              onChangeText={setUsername}
                                autoCapitalize='none'
                          />
                      </View>
                  </View>
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
                  <TouchableOpacity style={styles.button} onPress={handRegister}>
                      {isLoading ? (
                          <ActivityIndicator color="#fff" />) : (
                            <Text style={styles.buttonText}>Sign up</Text>
                    )}                    
                  </TouchableOpacity>
                  <View style={styles.footer}>
                      <Text style={styles.footerText}>Already have an account?</Text>
                      <TouchableOpacity onPress={()=>router.back()}>
                              <Text style={styles.link}>Login</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </View>
    </KeyboardAvoidingView>
  )
}