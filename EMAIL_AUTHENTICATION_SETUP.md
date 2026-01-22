# Email Authentication & Location Setup Guide

## 🎯 Overview

This guide covers the email verification system and automatic location detection implemented in the student signup process.

---

## ✨ What's New

### 1. **Automatic Location Detection**
- App automatically requests user's location permission on load
- Location is reverse-geocoded to get city, state, and region
- Users can:
  - ✓ Allow automatic location fill
  - ✓ Manually edit/override detected location
  - ✓ Refresh location if needed
  - ✓ Enter location manually from scratch

### 2. **Enhanced Email Verification**
- Email verification via Firebase email link
- Students must verify email before completing signup
- Detailed error messages for troubleshooting
- Console logging for debugging

### 3. **Better Error Handling**
- Improved Firebase initialization error catching
- Fallback mechanisms if Firebase fails
- User-friendly error messages

---

## 🔧 Firebase Email/Password Authentication Setup

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **unifiedcampus-e545d**
3. Navigate to **Authentication** (left sidebar)
4. Click **Sign-in method** tab
5. Find **Email/Password**
6. Click to expand, then toggle **ENABLE** (should turn green)
7. Make sure **Email link (passwordless sign-in)** is also enabled
8. Click **Save**

### Step 2: Set Authorized Domains

1. In Authentication → **Settings** tab
2. Scroll to **Authorized domains**
3. Add these domains:
   - `localhost:3000` (for development)
   - `localhost:5173` (for Vite dev)
   - Your production domain (e.g., `thepass.app`)

### Step 3: Create a Test User (Optional)

If you want to test without email verification:

1. In Authentication → **Users** tab
2. Click **Add user**
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123456` (6+ characters)
4. Click **Create user**

---

## 📧 Email Verification Flow

### How It Works:

1. **User Signs Up** → Enters email, name, location, etc.
2. **Verify Email** → Clicks "Verify" button
3. **Email Link Sent** → Firebase sends verification email link
4. **User Clicks Link** → Opens verification email, clicks link
5. **Email Verified** → Account is verified in Firebase
6. **Complete Signup** → User proceeds with registration

### Key Components:

- **StudentSignup.tsx** - Signup form with location auto-fill
- **EmailLinkVerificationModal.tsx** - Email verification modal
- **AuthContext.tsx** - Authentication logic & error handling
- **firebase.ts** - Firebase configuration

---

## 🗺️ Location Features

### Automatic Detection Flow:

```
App Loads
    ↓
Request Location Permission
    ↓
Get User's GPS Coordinates
    ↓
Reverse Geocode (OpenStreetMap Nominatim)
    ↓
Extract City, State, Region
    ↓
Auto-fill Form Fields
    ↓
User can edit/override manually
```

### Location Fields:

- **Region** - State/Province level
- **City** - City/Town
- **State** - State/Province (same as region in most cases)

All fields are editable and not locked after auto-fill.

---

## 🐛 Troubleshooting

### **Issue: "Login error: Firebase: Error (auth/invalid-credential)"**

**Cause:** Email/Password authentication not enabled in Firebase

**Solution:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Refresh your app and try again

### **Issue: "Firebase is not configured"**

**Cause:** Firebase credentials missing or invalid in `.env` file

**Solution:**
1. Check `.env` file has all Firebase keys:
   - VITE_FIREBASE_apiKey
   - VITE_FIREBASE_authDomain
   - VITE_FIREBASE_projectId
   - VITE_FIREBASE_appId
2. Make sure `USE_DEMO_MODE = false` in `src/app/config/firebase.ts`
3. Restart dev server

### **Issue: "Verification link sent" but email not received**

**Solutions:**
- Check spam/promotions folder
- Wait 5 minutes (email can take time)
- Click "Didn't receive it? Send again" in modal
- Check Firebase has correct verified domain configured

### **Issue: Location not detected**

**Solutions:**
1. Allow location permission when browser prompts
2. Use "Enable Location Access" button in signup form
3. Enter location manually
4. Check browser console (F12) for permission errors

### **Check Console Logs:**

Open browser DevTools (F12) → Console tab to see:

```
✓ Location detected: 28.7041 77.1025
🔐 Attempting Firebase login
✅ Firebase authentication successful
📧 Preparing to send verification email to: user@example.com
✅ Verification email sent successfully
✅ Email verified successfully!
```

---

## 📱 Testing Checklist

- [ ] Location permission shows on app load
- [ ] Location auto-fills when approved
- [ ] Location fields are editable
- [ ] Can manually enter location without auto-fill
- [ ] Email verification button appears
- [ ] Email verification link sent (check spam folder)
- [ ] Can verify email by clicking link
- [ ] Login works with verified email
- [ ] Appropriate error messages display

---

## 🔑 Key Console Messages

### Location Logs:
```
✓ Location detected: latitude longitude
⚠️ Geolocation permission denied
📍 Fetching location details...
```

### Email Verification Logs:
```
📧 Preparing to send verification email
📬 Sending sign-in link with URL: ...
✅ Verification email sent successfully
✉️ Email verification link detected
🔐 Verifying email link
✅ Email verified successfully!
```

### Authentication Logs:
```
🔐 Attempting Firebase login
✅ Firebase authentication successful
❌ Login error: [error details]
```

---

## 📝 Configuration Files

### `.env` (Required)
```dotenv
VITE_FIREBASE_apiKey=...
VITE_FIREBASE_authDomain=...
VITE_FIREBASE_projectId=...
VITE_FIREBASE_storageBucket=...
VITE_FIREBASE_messagingSenderId=...
VITE_FIREBASE_appId=...
```

### `src/app/config/firebase.ts`
```typescript
export const USE_DEMO_MODE = false; // Set to true for localStorage mode
```

---

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Enable Email/Password auth in Firebase
2. ✅ Add production domain to Firebase authorized domains
3. ✅ Set `USE_DEMO_MODE = false`
4. ✅ Update `.env` with production Firebase keys
5. ✅ Test email verification in production domain
6. ✅ Test location detection on target devices
7. ✅ Monitor console logs for errors

---

## 📞 Support

For issues or questions:
1. Check browser console (F12) for detailed error messages
2. Review Firebase Console for user authentication status
3. Verify Firebase configuration matches `.env` values
4. Check network tab for failed requests

