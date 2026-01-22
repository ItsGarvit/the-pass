import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, BookOpen, Calendar, MapPin, User, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { CollegeSearchDropdown } from "./CollegeSearchDropdown";
import { BranchDropdown } from "./BranchDropdown";

interface StudentSignupProps {
  onBack: () => void;
  onSwitchToLogin?: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export function StudentSignup({ onBack, onSwitchToLogin, userLocation }: StudentSignupProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    region: "",
    city: "",
    state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  useEffect(() => {
    // Auto-fill region based on location
    if (userLocation && !formData.region) {
      fetchLocationDetails(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const fetchLocationDetails = async (lat: number, lng: number) => {
    setIsLoadingLocation(true);
    try {
      // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ThePass/1.0' // Nominatim requires a user agent
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }

      const data = await response.json();

      // Extract address components
      const address = data.address || {};
      
      // Get city (try multiple possible fields)
      const city = address.city || 
                   address.town || 
                   address.village || 
                   address.municipality || 
                   address.county || 
                   '';

      // Get state
      const state = address.state || 
                    address.province || 
                    address.region || 
                    '';

      // Get region (could be state or a larger region)
      const region = address.state || 
                     address.region || 
                     address.country || 
                     '';

      // Update form with real location data
      setFormData(prev => ({
        ...prev,
        city: city,
        state: state,
        region: region,
      }));

      setIsLoadingLocation(false);
    } catch (error) {
      setIsLoadingLocation(false);
      // Show a user-friendly message but don't block the form
      setLocationError("We couldn't automatically detect your location. Please enter your address manually.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    // Validate required fields
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!formData.college) {
      setError("College is required");
      return;
    }

    if (!formData.branch) {
      setError("Branch is required");
      return;
    }

    if (!formData.year) {
      setError("Year is required");
      return;
    }

    setIsLoading(true);
    console.log('📝 Creating student account for:', formData.fullName, formData.email);
    try {
      await signup(formData, formData.password, 'student');
      console.log('✅ Signup successful');
      // Success - the AuthContext will handle redirecting to dashboard
    } catch (err: any) {
      console.error('❌ Signup failed:', err.message);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleManualLocationRequest = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationDetails(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setIsLoadingLocation(false);
          setLocationError('Could not access your location. Please enter it manually.');
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Signup Card */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-8 md:p-12 border-4 border-gray-900 dark:border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 p-4 rounded-3xl mb-4 border-2 border-gray-900 dark:border-gray-100"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              Student Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join The Pass and start your learning journey
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                <p className="text-red-700 dark:text-red-300 text-center font-medium">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            {/* College Field */}
            <div>
              <label htmlFor="college" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                College Name
              </label>
              <CollegeSearchDropdown
                state={formData.state}
                value={formData.college}
                onChange={(college) => setFormData(prev => ({ ...prev, college }))}
                disabled={isLoadingLocation}
              />
              {!formData.state && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Select your state first to see available colleges
                </p>
              )}
            </div>

            {/* Branch Field */}
            <div>
              <label htmlFor="branch" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Branch
              </label>
              <BranchDropdown
                college={formData.college}
                value={formData.branch}
                onChange={(branch) => setFormData(prev => ({ ...prev, branch }))}
                disabled={isLoadingLocation}
              />
            </div>

            {/* Year Field */}
            <div>
              <label htmlFor="year" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Location Info Message */}
            {isLoadingLocation && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <p className="text-blue-700 dark:text-blue-300 text-center font-medium">
                  📍 Fetching your location details...
                </p>
              </div>
            )}

            {formData.region && !isLoadingLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4">
                <p className="text-green-700 dark:text-green-300 text-center font-medium mb-2">
                  ✓ Location auto-filled from GPS
                </p>
                <p className="text-green-600 dark:text-green-400 text-center text-sm">
                  Detected: {formData.city && `${formData.city}, `}{formData.state && `${formData.state}, `}{formData.region}
                </p>
                <button
                  type="button"
                  onClick={handleManualLocationRequest}
                  className="mt-2 w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  🔄 Refresh Location
                </button>
              </div>
            )}

            {locationError && !isLoadingLocation && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                <p className="text-red-700 dark:text-red-300 text-center font-medium mb-2">
                  ❌ {locationError}
                </p>
                <button
                  type="button"
                  onClick={handleManualLocationRequest}
                  className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  🔄 Try Again
                </button>
              </div>
            )}

            {!formData.region && !isLoadingLocation && !locationError && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                <p className="text-amber-700 dark:text-amber-300 text-center font-medium mb-2">
                  📍 Auto-detect your location
                </p>
                <button
                  type="button"
                  onClick={handleManualLocationRequest}
                  className="w-full px-3 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  📍 Enable Location Access
                </button>
                <p className="text-amber-600 dark:text-amber-400 text-center text-xs mt-2">
                  Or enter your details manually below
                </p>
              </div>
            )}

            {/* Region Field */}
            <div>
              <label htmlFor="region" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Your Region"
                />
              </div>
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="city" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Your City"
                />
              </div>
            </div>

            {/* State Field */}
            <div>
              <label htmlFor="state" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                  placeholder="Your State"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white font-bold py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              {onSwitchToLogin ? (
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  Login here
                </button>
              ) : (
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                  Login here
                </a>
              )}
            </p>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 dark:from-yellow-500 dark:to-orange-500 rounded-[2rem] opacity-50 blur-sm -z-10"
        />
      </motion.div>

          {/* Email Link Verification Modal */}
      </motion.div>
    </div>
  );
}