import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import Scene3D from "./components/Scene3D";
import { StatsSection } from "./components/StatsSection";
import { AboutSection } from "./components/AboutSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ContactSection } from "./components/ContactSection";
import { GetStartedModal } from "./components/GetStartedModal";
import { StudentLogin } from "./components/StudentLogin";
import { MentorLogin } from "./components/MentorLogin";
import { CompanyLogin } from "./components/CompanyLogin";
import { CollegeLogin } from "./components/CollegeLogin";
import { StudentSignup } from "./components/StudentSignup";
import { MentorSignup } from "./components/MentorSignup";
import { CompanySignup } from "./components/CompanySignup";
import { CollegeSignup } from "./components/CollegeSignup";
import { StudentDashboard } from "./components/StudentDashboard";
import { MentorDashboard } from "./components/MentorDashboard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { CollegeDashboard } from "./components/CollegeDashboard";
import { Footer } from "./components/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { auth } from "./config/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getPendingSignupData, clearPendingSignupData } from "./components/EmailLinkVerificationModal";
import { toast } from "sonner";
import { Toaster } from "sonner";

type ViewType = 
  | "landing" 
  | "student-login" | "mentor-login" | "company-login" | "college-login"
  | "student-signup" | "mentor-signup" | "company-signup" | "college-signup";

type RoleType = "student" | "mentor" | "company" | "college";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("signup");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Get user's location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log('✓ Location detected:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('⚠️ Geolocation permission denied or unavailable:', error.message);
          // Don't block the app if location is not available
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    } else {
      console.warn('⚠️ Geolocation is not supported by this browser');
    }
  }, []);

  // Handle email link verification on app load
  useEffect(() => {
    const handleEmailLinkVerification = async () => {
      if (auth && isSignInWithEmailLink(auth, window.location.href)) {
        console.log('✉️ Email verification link detected');
        let email = localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // If email is not in localStorage, prompt the user
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          try {
            console.log('🔐 Verifying email link for:', email);
            await signInWithEmailLink(auth, email, window.location.href);
            console.log('✅ Email verified successfully!');
            
            // Get pending signup data
            const pendingData = getPendingSignupData();
            if (pendingData) {
              // Clear the pending data
              clearPendingSignupData();
              console.log('📝 Completing account creation with stored data');
              toast.success("Email verified successfully! Your account is being created...");
            } else {
              console.log('✅ Email verified (no pending signup data)');
              toast.success("Email verified successfully!");
            }
            
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error: any) {
            console.error('❌ Error verifying email link:', error.code, error.message);
            
            if (error.code === 'auth/invalid-email') {
              toast.error("Invalid email address");
            } else if (error.code === 'auth/expired-action-code') {
              toast.error("Verification link has expired. Please sign up again.");
            } else if (error.code === 'auth/invalid-action-code') {
              toast.error("Invalid verification link. Please request a new one.");
            } else {
              toast.error(error.message || "Failed to verify email");
            }
          }
        }
      }
    };
    
    handleEmailLinkVerification();
  }, []);


  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleNavigateToLogin = (role: RoleType) => {
    setCurrentView(`${role}-login` as ViewType);
  };

  const handleNavigateToSignup = (role: RoleType) => {
    setCurrentView(`${role}-signup` as ViewType);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  console.log("App rendering, theme:", theme);

  // Show dashboard if authenticated
  if (isAuthenticated && user) {
    if (user.userType === 'student') {
      return <StudentDashboard />;
    } else if (user.userType === 'mentor') {
      return <MentorDashboard />;
    } else if (user.userType === 'company') {
      return <CompanyDashboard />;
    } else if (user.userType === 'college') {
      return <CollegeDashboard />;
    }
  }

  // Show login screens
  if (currentView === "student-login") {
    return (
      <StudentLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("student-signup")}
      />
    );
  }

  if (currentView === "mentor-login") {
    return (
      <MentorLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("mentor-signup")}
      />
    );
  }

  if (currentView === "company-login") {
    return (
      <CompanyLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("company-signup")}
      />
    );
  }

  if (currentView === "college-login") {
    return (
      <CollegeLogin
        onBack={handleBackToLanding}
        onSwitchToSignup={() => setCurrentView("college-signup")}
      />
    );
  }

  // Show signup screens
  if (currentView === "student-signup") {
    return (
      <StudentSignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("student-login")}
        userLocation={userLocation}
      />
    );
  }

  if (currentView === "mentor-signup") {
    return (
      <MentorSignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("mentor-login")}
      />
    );
  }

  if (currentView === "company-signup") {
    return (
      <CompanySignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("company-login")}
      />
    );
  }

  if (currentView === "college-signup") {
    return (
      <CollegeSignup
        onBack={handleBackToLanding}
        onSwitchToLogin={() => setCurrentView("college-login")}
      />
    );
  }

  // Show landing page
  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Spline 3D Robot Background */}
      <Scene3D />
      <Header
        onLogin={() => {
          setModalMode("login");
          setIsModalOpen(true);
        }}
        onSignup={() => {
          setModalMode("signup");
          setIsModalOpen(true);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main style={{ width: '100%' }}>
        <HeroSection onGetStarted={() => setIsModalOpen(true)} />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <ContactSection />
      </main>

      <Footer />

      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToSignup={handleNavigateToSignup}
        onLocationCaptured={setUserLocation}
        mode={modalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}