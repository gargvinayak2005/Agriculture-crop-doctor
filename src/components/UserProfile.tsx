import React, { useState } from 'react';
import { User, LogOut, Settings, Edit3, Save, X } from 'lucide-react';

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

interface UserProfileProps {
  user: UserData;
  onLogout: () => void;
  currentLanguage: 'en' | 'hi' | 'kn';
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, currentLanguage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    phone: user.phone || '',
    location: user.location || '',
    farmSize: user.farmSize || '',
    cropTypes: user.cropTypes || ''
  });

  const translations = {
    en: {
      profile: 'Profile',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      logout: 'Logout',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      farmSize: 'Farm Size',
      cropTypes: 'Crop Types',
      memberSince: 'Member since'
    },
    hi: {
      profile: 'प्रोफाइल',
      editProfile: 'प्रोफाइल संपादित करें',
      saveChanges: 'परिवर्तन सहेजें',
      cancel: 'रद्द करें',
      logout: 'लॉगआउट',
      name: 'नाम',
      email: 'ईमेल',
      phone: 'फोन',
      location: 'स्थान',
      farmSize: 'खेत का आकार',
      cropTypes: 'फसल के प्रकार',
      memberSince: 'सदस्य बने'
    },
    kn: {
      profile: 'ಪ್ರೊಫೈಲ್',
      editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
      saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      logout: 'ಲಾಗ್ಔಟ್',
      name: 'ಹೆಸರು',
      email: 'ಇಮೇಲ್',
      phone: 'ಫೋನ್',
      location: 'ಸ್ಥಳ',
      farmSize: 'ಫಾರ್ಮ್ ಗಾತ್ರ',
      cropTypes: 'ಬೆಳೆ ಪ್ರಕಾರಗಳು',
      memberSince: 'ಸದಸ್ಯರಾದ ದಿನಾಂಕ'
    }
  };

  const t = translations[currentLanguage];

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      phone: user.phone || '',
      location: user.location || '',
      farmSize: user.farmSize || '',
      cropTypes: user.cropTypes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="w-6 h-6 mr-2 text-green-600" />
          {t.profile}
        </h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <button
            onClick={onLogout}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
            <p className="text-gray-800">{user.email}</p>
          </div>

          {(user.phone || isEditing) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{user.phone || 'Not provided'}</p>
              )}
            </div>
          )}

          {(user.location || isEditing) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{user.location || 'Not provided'}</p>
              )}
            </div>
          )}

          {(user.farmSize || isEditing) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.farmSize}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.farmSize}
                  onChange={(e) => setEditData({...editData, farmSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{user.farmSize ? `${user.farmSize} acres` : 'Not provided'}</p>
              )}
            </div>
          )}

          {(user.cropTypes || isEditing) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.cropTypes}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.cropTypes}
                  onChange={(e) => setEditData({...editData, cropTypes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{user.cropTypes || 'Not provided'}</p>
              )}
            </div>
          )}
        </div>

        {/* Member Since */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {t.memberSince} {new Date(user.loginTime).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;