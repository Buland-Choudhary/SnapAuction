import { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';

const UserProfile = ({ user: initialUser, onUpdateProfile }) => {
  const [user, setUser] = useState(initialUser || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate collector and auction enthusiast with over 5 years of experience.'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ avatar: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Please select a valid image file' });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setErrors({});
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarPreview) return;
    
    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEditForm(prev => ({ ...prev, avatar: avatarPreview }));
      setAvatarPreview(null);
    } catch {
      setErrors({ avatar: 'Failed to upload avatar' });
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!editForm.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (editForm.phone && !/^\+?[\d\s\-()]+$/.test(editForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setUser(editForm);
      if (onUpdateProfile) {
        await onUpdateProfile(editForm);
      }
      setIsEditing(false);
      setAvatarPreview(null);
      setErrors({});
    } catch {
      setErrors({ general: 'Failed to update profile' });
    }
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
    setAvatarPreview(null);
    setErrors({});
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 hover:scale-105"
              aria-label="Edit profile"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Save changes"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4 -mt-16">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-600">
              <img
                src={avatarPreview || editForm.avatar || user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Change avatar"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload new avatar"
            />
          </div>

          {avatarPreview && (
            <div className="flex gap-2">
              <button
                onClick={uploadAvatar}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Apply'}</span>
              </button>
              <button
                onClick={() => setAvatarPreview(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {errors.avatar && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.avatar}</span>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              {isEditing ? (
                <FloatingLabelInput
                  label="Full Name"
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  error={errors.name}
                  icon={User}
                  required
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              {isEditing ? (
                <FloatingLabelInput
                  label="Email Address"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                  icon={Mail}
                  required
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              {isEditing ? (
                <FloatingLabelInput
                  label="Phone Number"
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  error={errors.phone}
                  icon={Phone}
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              {isEditing ? (
                <FloatingLabelInput
                  label="Location"
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  icon={MapPin}
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.location || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Member since</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatJoinDate(user.joinDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
