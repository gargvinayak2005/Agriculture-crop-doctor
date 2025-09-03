import React, { useState, useRef, useCallback } from 'react';
import { Camera, Mic, MicOff, Upload, Leaf, Cloud, AlertTriangle, Calendar, MapPin, Volume2, Languages, User, LogOut } from 'lucide-react';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import apiService from './services/api';

interface DiseaseResult {
  disease: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  pesticides: string[];
  severity: 'low' | 'medium' | 'high';
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  alert?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farmSize?: string;
  cropTypes?: string;
  loginTime: string;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'kn'>('en');
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('diagnose');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  };

  const translations = {
    en: {
      title: 'AI Crop Doctor',
      subtitle: 'Voice + Image Agriculture Assistant',
      diagnose: 'Diagnose',
      weather: 'Weather',
      schedule: 'Schedule',
      uploadImage: 'Upload Crop Image',
      takePhoto: 'Take Photo',
      startRecording: 'Start Voice Recording',
      stopRecording: 'Stop Recording',
      analyzing: 'Analyzing crop...',
      diseaseDetected: 'Disease Detected',
      confidence: 'Confidence',
      symptoms: 'Symptoms',
      treatment: 'Treatment',
      pesticides: 'Recommended Pesticides',
      weatherToday: "Today's Weather",
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      fertilizerSchedule: 'Fertilizer Schedule',
      location: 'Location: Rural Karnataka'
    },
    hi: {
      title: 'एआई क्रॉप डॉक्टर',
      subtitle: 'आवाज + छवि कृषि सहायक',
      diagnose: 'निदान',
      weather: 'मौसम',
      schedule: 'कार्यक्रम',
      uploadImage: 'फसल की छवि अपलोड करें',
      takePhoto: 'फोटो लें',
      startRecording: 'आवाज रिकॉर्डिंग शुरू करें',
      stopRecording: 'रिकॉर्डिंग बंद करें',
      analyzing: 'फसल का विश्लेषण कर रहे हैं...',
      diseaseDetected: 'बीमारी का पता चला',
      confidence: 'विश्वसनीयता',
      symptoms: 'लक्षण',
      treatment: 'उपचार',
      pesticides: 'अनुशंसित कीटनाशक',
      weatherToday: 'आज का मौसम',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      rainfall: 'वर्षा',
      fertilizerSchedule: 'उर्वरक कार्यक्रम',
      location: 'स्थान: ग्रामीण कर्नाटक'
    },
    kn: {
      title: 'ಎಐ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್',
      subtitle: 'ಧ್ವನಿ + ಚಿತ್ರ ಕೃಷಿ ಸಹಾಯಕ',
      diagnose: 'ರೋಗನಿರ್ಣಯ',
      weather: 'ಹವಾಮಾನ',
      schedule: 'ವೇಳಾಪಟ್ಟಿ',
      uploadImage: 'ಬೆಳೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
      startRecording: 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
      stopRecording: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
      analyzing: 'ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
      diseaseDetected: 'ರೋಗ ಪತ್ತೆಯಾಗಿದೆ',
      confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
      symptoms: 'ಲಕ್ಷಣಗಳು',
      treatment: 'ಚಿಕಿತ್ಸೆ',
      pesticides: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕಗಳು',
      weatherToday: 'ಇಂದಿನ ಹವಾಮಾನ',
      temperature: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      rainfall: 'ಮಳೆ',
      fertilizerSchedule: 'ರಸಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ',
      location: 'ಸ್ಥಳ: ಗ್ರಾಮೀಣ ಕರ್ನಾಟಕ'
    }
  };

  const t = translations[currentLanguage];

  const mockDiseases = [
    {
      disease: 'Leaf Blight',
      confidence: 87,
      symptoms: ['Brown spots on leaves', 'Yellowing edges', 'Wilting'],
      treatment: ['Remove affected leaves', 'Apply copper fungicide', 'Improve drainage'],
      pesticides: ['Copper Oxychloride', 'Mancozeb', 'Propiconazole'],
      severity: 'medium' as const
    },
    {
      disease: 'Powdery Mildew',
      confidence: 92,
      symptoms: ['White powdery coating', 'Leaf distortion', 'Stunted growth'],
      treatment: ['Spray neem oil', 'Increase air circulation', 'Apply sulfur fungicide'],
      pesticides: ['Neem Oil', 'Sulfur', 'Triadimefon'],
      severity: 'high' as const
    }
  ];

  const mockWeather: WeatherData = {
    temperature: 28,
    humidity: 72,
    rainfall: 15,
    condition: 'Partly Cloudy',
    alert: 'High humidity may increase fungal disease risk'
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeCrop();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCrop = useCallback(() => {
    setIsAnalyzing(true);
    setDiseaseResult(null);
    
    // Simulate AI analysis
    setTimeout(() => {
      const randomResult = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setDiseaseResult(randomResult);
      setIsAnalyzing(false);
      
      // Text-to-speech for results
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `${randomResult.disease} detected with ${randomResult.confidence}% confidence`
        );
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    }, 2000);
  }, [currentLanguage]);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.start();
        
        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
        }, 5000);
        
        mediaRecorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setIsRecording(false);
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    apiService.clearToken();
    setUser(null);
    setShowProfile(false);
    setSelectedImage(null);
    setDiseaseResult(null);
    setActiveTab('diagnose');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-green-100 text-sm">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <Languages className="w-5 h-5" />
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as 'en' | 'hi' | 'kn')}
                className="bg-green-500 text-white rounded-lg px-3 py-1 text-sm border-0 focus:ring-2 focus:ring-green-300"
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code} className="bg-green-600">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              
              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 px-3 py-2 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-green-100 hover:text-white hover:bg-green-500 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center justify-between mt-4 text-green-100">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{user?.location || t.location}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        {showProfile && user && (
          <div className="mb-8">
            <UserProfile 
              user={user} 
              onLogout={handleLogout} 
              currentLanguage={currentLanguage}
            />
          </div>
        )}

        {/* Authentication Required Message */}
        {!user && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to AI Crop Doctor</h2>
            <p className="text-gray-600 mb-6">Please login or create an account to access crop diagnosis and agricultural assistance features.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        {user && (
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8">
          {[
            { id: 'diagnose', label: t.diagnose, icon: Camera },
            { id: 'weather', label: t.weather, icon: Cloud },
            { id: 'schedule', label: t.schedule, icon: Calendar }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
          </div>
        )}

        {/* Diagnose Tab */}
        {user && activeTab === 'diagnose' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-green-600" />
                {t.uploadImage}
              </h2>
              
              <div className="space-y-4">
                {/* Image Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Crop" className="w-full h-48 object-cover rounded-lg mb-4" />
                  ) : (
                    <div className="py-12">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t.uploadImage}</p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{t.uploadImage}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Voice Recording Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mic className="w-6 h-6 mr-2 text-green-600" />
                Voice Assistant
              </h2>
              
              <div className="space-y-4">
                {/* Recording Button */}
                <div className="text-center">
                  <button
                    onClick={toggleRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <p className="mt-3 text-sm text-gray-600">
                    {isRecording ? t.stopRecording : t.startRecording}
                  </p>
                </div>
                
                {/* Voice Recording Status */}
                {isRecording && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                      <span className="text-sm font-medium">Recording...</span>
                    </div>
                  </div>
                )}
                
                {/* Voice Commands Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Voice Commands:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>"My crop leaves are turning yellow"</li>
                    <li>"What pesticide should I use?"</li>
                    <li>"When to apply fertilizer?"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {user && (isAnalyzing || diseaseResult) && activeTab === 'diagnose' && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t.analyzing}</p>
              </div>
            ) : diseaseResult && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                    {t.diseaseDetected}
                  </h2>
                  <button
                    onClick={() => speakText(`${diseaseResult.disease} detected with ${diseaseResult.confidence}% confidence`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disease Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{diseaseResult.disease}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(diseaseResult.severity)}`}>
                        {diseaseResult.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{t.confidence}</span>
                        <span className="text-lg font-semibold text-green-600">{diseaseResult.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${diseaseResult.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t.symptoms}</h4>
                      <ul className="space-y-1">
                        {diseaseResult.symptoms.map((symptom, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Treatment & Pesticides */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t.treatment}</h4>
                      <ul className="space-y-1">
                        {diseaseResult.treatment.map((step, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t.pesticides}</h4>
                      <div className="space-y-2">
                        {diseaseResult.pesticides.map((pesticide, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <span className="text-sm font-medium text-blue-800">{pesticide}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weather Tab */}
        {user && activeTab === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Cloud className="w-6 h-6 mr-2" />
                {t.weatherToday}
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{mockWeather.temperature}°C</div>
                  <div className="text-blue-100">{mockWeather.condition}</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">{t.humidity}</span>
                    <span className="font-semibold">{mockWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">{t.rainfall}</span>
                    <span className="font-semibold">{mockWeather.rainfall}mm</span>
                  </div>
                </div>
              </div>
              
              {mockWeather.alert && (
                <div className="mt-4 bg-orange-500 bg-opacity-20 border border-orange-300 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-200" />
                    <span className="text-sm">{mockWeather.alert}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Weather Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">Good conditions for spraying pesticides</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">Monitor for fungal diseases due to humidity</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">Consider irrigation if no rain expected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {user && activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fertilizer Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-green-600" />
                {t.fertilizerSchedule}
              </h2>
              
              <div className="space-y-4">
                {[
                  { week: 'Week 1-2', fertilizer: 'NPK 10:26:26', amount: '50kg/acre', status: 'completed' },
                  { week: 'Week 4-5', fertilizer: 'Urea', amount: '25kg/acre', status: 'upcoming' },
                  { week: 'Week 8-9', fertilizer: 'Potash', amount: '30kg/acre', status: 'pending' }
                ].map((item, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    item.status === 'completed' ? 'bg-green-50 border-green-200' :
                    item.status === 'upcoming' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.week}</h4>
                        <p className="text-sm text-gray-600">{item.fertilizer} - {item.amount}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pesticide Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                Pesticide Schedule
              </h2>
              
              <div className="space-y-4">
                {[
                  { date: 'Jan 15', pesticide: 'Insecticide spray', crop: 'Tomato', status: 'done' },
                  { date: 'Jan 22', pesticide: 'Fungicide application', crop: 'Wheat', status: 'today' },
                  { date: 'Jan 29', pesticide: 'Herbicide spray', crop: 'Rice', status: 'scheduled' }
                ].map((item, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    item.status === 'done' ? 'bg-green-50 border-green-200' :
                    item.status === 'today' ? 'bg-orange-50 border-orange-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.date}</h4>
                        <p className="text-sm text-gray-600">{item.pesticide} for {item.crop}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'done' ? 'bg-green-100 text-green-800' :
                        item.status === 'today' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

export default App;