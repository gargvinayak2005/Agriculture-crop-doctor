import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, Leaf } from 'lucide-react';
import apiService, { LoginData, RegisterData } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
  currentLanguage: 'en' | 'hi' | 'kn';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, currentLanguage }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    farmSize: '',
    cropTypes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      welcome: 'Welcome Back',
      createAccount: 'Create Account',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone Number',
      location: 'Farm Location',
      farmSize: 'Farm Size (acres)',
      cropTypes: 'Crop Types',
      loginButton: 'Login to Continue',
      signupButton: 'Create Account',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Login',
      forgotPassword: 'Forgot Password?',
      loginSuccess: 'Login successful! Welcome to AI Crop Doctor.',
      signupSuccess: 'Account created successfully! Welcome to AI Crop Doctor.'
    },
    hi: {
      login: 'लॉगिन',
      signup: 'साइन अप',
      welcome: 'वापसी पर स्वागत',
      createAccount: 'खाता बनाएं',
      email: 'ईमेल',
      password: 'पासवर्ड',
      name: 'पूरा नाम',
      phone: 'फोन नंबर',
      location: 'खेत का स्थान',
      farmSize: 'खेत का आकार (एकड़)',
      cropTypes: 'फसल के प्रकार',
      loginButton: 'जारी रखने के लिए लॉगिन करें',
      signupButton: 'खाता बनाएं',
      switchToSignup: 'खाता नहीं है? साइन अप करें',
      switchToLogin: 'पहले से खाता है? लॉगिन करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      loginSuccess: 'लॉगिन सफल! एआई क्रॉप डॉक्टर में आपका स्वागत है।',
      signupSuccess: 'खाता सफलतापूर्वक बनाया गया! एआई क्रॉप डॉक्टर में आपका स्वागत है।'
    },
    kn: {
      login: 'ಲಾಗಿನ್',
      signup: 'ಸೈನ್ ಅಪ್',
      welcome: 'ಮರಳಿ ಬಂದಿದ್ದಕ್ಕೆ ಸ್ವಾಗತ',
      createAccount: 'ಖಾತೆ ರಚಿಸಿ',
      email: 'ಇಮೇಲ್',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      name: 'ಪೂರ್ಣ ಹೆಸರು',
      phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
      location: 'ಫಾರ್ಮ್ ಸ್ಥಳ',
      farmSize: 'ಫಾರ್ಮ್ ಗಾತ್ರ (ಎಕರೆ)',
      cropTypes: 'ಬೆಳೆ ಪ್ರಕಾರಗಳು',
      loginButton: 'ಮುಂದುವರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ',
      signupButton: 'ಖಾತೆ ರಚಿಸಿ',
      switchToSignup: 'ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ',
      switchToLogin: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
      forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
      loginSuccess: 'ಲಾಗಿನ್ ಯಶಸ್ವಿ! ಎಐ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್‌ಗೆ ಸ್ವಾಗತ।',
      signupSuccess: 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ಎಐ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್‌ಗೆ ಸ್ವಾಗತ।'
    }
  };

  const t = translations[currentLanguage];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Login
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password
        };
        
        const response = await apiService.login(loginData);
        apiService.setToken(response.token);
        
        const userData = {
          id: response.user.id,
          name: response.user.username,
          email: response.user.email,
          phone: response.user.phone,
          location: response.user.location,
          farmSize: response.user.farmSize,
          cropTypes: response.user.cropTypes,
          loginTime: new Date().toISOString()
        };

        onLogin(userData);
        
        // Show success message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(t.loginSuccess);
          utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      } else {
        // Register
        const registerData: RegisterData = {
          username: formData.name || 'Farmer',
          email: formData.email,
          password: formData.password,
          phone: formData.phone || '',
          location: formData.location || '',
          farmSize: formData.farmSize || '',
          cropTypes: formData.cropTypes || ''
        };
        
        console.log('Sending registration data:', registerData);
        
        const response = await apiService.register(registerData);
        apiService.setToken(response.token);
        
        const userData = {
          id: response.user.id,
          name: response.user.username,
          email: response.user.email,
          phone: response.user.phone,
          location: response.user.location,
          farmSize: response.user.farmSize,
          cropTypes: response.user.cropTypes,
          loginTime: new Date().toISOString()
        };

        onLogin(userData);
        
        // Show success message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(t.signupSuccess);
          utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      alert(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isLoginMode ? t.welcome : t.createAccount}
                </h2>
                <p className="text-green-100 text-sm">AI Crop Doctor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-green-100 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLoginMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder={t.name}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {t.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder={t.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              {t.password}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder={t.password}
            />
          </div>

          {!isLoginMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder={t.phone}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.location}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder={t.location}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.farmSize}
                  </label>
                  <input
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cropTypes}
                  </label>
                  <input
                    type="text"
                    name="cropTypes"
                    value={formData.cropTypes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Rice, Wheat"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLoginMode ? t.loginButton : t.signupButton}</span>
            )}
          </button>

          {/* Forgot Password */}
          {isLoginMode && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                {t.forgotPassword}
              </button>
            </div>
          )}

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              {isLoginMode ? t.switchToSignup : t.switchToLogin}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;