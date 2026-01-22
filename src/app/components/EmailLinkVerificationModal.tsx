import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../config/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

interface EmailLinkVerificationModalProps {
  email: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  formData: any; // The signup form data to store
}

const PENDING_SIGNUP_KEY = 'pendingSignupData';

export function EmailLinkVerificationModal({
  email,
  userName,
  isOpen,
  onClose,
  onVerified,
  formData
}: EmailLinkVerificationModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendLink = async () => {
    setIsSending(true);
    setError(null);

    try {
      if (!auth) {
        throw new Error("Firebase Auth not initialized");
      }

      // Store the signup data in localStorage so we can complete registration after verification
      localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify({
        ...formData,
        email,
        userName,
        timestamp: Date.now()
      }));

      // Configure the action code settings
      const actionCodeSettings = {
        url: window.location.origin + '/verify-email',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Store email for verification step
      localStorage.setItem('emailForSignIn', email);
      
      setEmailSent(true);
      toast.success("Verification link sent to your email!");
    } catch (err: any) {
      console.error(err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-email') {
        setError("Invalid email address");
      } else if (err.code === 'auth/missing-continue-uri') {
        setError("Configuration error. Please contact support.");
      } else {
        setError(err.message || "Failed to send verification link");
      }
      toast.error(err.message || "Failed to send verification link");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-gray-900 dark:border-gray-100 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={emailSent ? { scale: [1, 1.2, 1] } : {}}
              className={`inline-block p-4 rounded-3xl mb-4 border-2 border-gray-900 dark:border-gray-100 ${
                emailSent
                  ? "bg-gradient-to-br from-green-400 to-emerald-400"
                  : "bg-gradient-to-br from-purple-500 to-indigo-500"
              }`}
            >
              {emailSent ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <Mail className="w-12 h-12 text-white" />
              )}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {emailSent ? "Check Your Email!" : "Verify Your Email"}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {emailSent ? (
                <>
                  We sent a verification link to<br />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
                </>
              ) : (
                <>
                  We'll send a verification link to<br />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
                </>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {!emailSent ? (
            <>
              {/* Info Box */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                  Click the button below to receive a verification link in your email. 
                  Click the link to verify your email and complete registration.
                </p>
              </div>

              {/* Send Link Button */}
              <motion.button
                whileHover={{ scale: isSending ? 1 : 1.02 }}
                whileTap={{ scale: isSending ? 1 : 0.98 }}
                onClick={handleSendLink}
                disabled={isSending}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white font-bold py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Verification Link
                  </>
                )}
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-700 dark:text-green-300 text-sm text-center">
                  <strong>Next step:</strong> Open your email and click the verification link. 
                  You can close this window.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Check your inbox (and spam folder)</span>
              </div>

              <button
                onClick={handleSendLink}
                disabled={isSending}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Didn't receive it? Send again"
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper to check and get pending signup data
export function getPendingSignupData() {
  const data = localStorage.getItem(PENDING_SIGNUP_KEY);
  if (!data) return null;
  
  const parsed = JSON.parse(data);
  
  // Check if data is less than 1 hour old
  if (Date.now() - parsed.timestamp > 60 * 60 * 1000) {
    localStorage.removeItem(PENDING_SIGNUP_KEY);
    return null;
  }
  
  return parsed;
}

export function clearPendingSignupData() {
  localStorage.removeItem(PENDING_SIGNUP_KEY);
  localStorage.removeItem('emailForSignIn');
}
