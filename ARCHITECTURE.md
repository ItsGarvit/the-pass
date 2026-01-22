# 🔄 System Architecture & Data Flow

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     THE PASS APP                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │   App.tsx        │◄────────┤  Geolocation API    │     │
│  │  (Main Router)   │         └──────────────────────┘     │
│  └────────┬─────────┘                                       │
│           │                                                 │
│           ├─────────────► StudentSignup.tsx                │
│           │              ├─ Location Detection             │
│           │              ├─ Email Verification             │
│           │              └─ Form Validation               │
│           │                                                │
│           ├─────────────► StudentLogin.tsx                 │
│           │              ├─ Email/Password Auth           │
│           │              └─ Error Handling                │
│           │                                                │
│           └─────────────► StudentDashboard.tsx             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Firebase Backend                          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Authentication  │  Firestore DB  │  Cloud Storage  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Location Detection Flow

```
USER VISITS APP
    ↓
┌───────────────────────────────────┐
│  Browser Prompts:                 │
│  "Allow location access?"         │
└───────────────────────────────────┘
    ↓                          ↓
 ALLOW                      DENY
    ↓                         ↓
Request GPS              Show Button:
    ↓                    "📍 Enable Access"
Get Coordinates              ↓
(latitude,                 User can:
 longitude)              ├─ Click button
    ↓                   │   (retry)
OpenStreetMap           └─ Enter manually
Reverse Geocoding           ↓
    ↓                   Filled
Extract:                Fields
├─ City
├─ State
├─ Region
    ↓
Auto-fill
Form Fields
    ↓
Display:
"✓ Location auto-filled"
    ↓
User can EDIT
any field
```

---

## 📧 Email Verification Flow

```
USER SIGNUP FORM
    ↓
VERIFY EMAIL BUTTON
    ↓
┌─────────────────────────────────────┐
│  EmailLinkVerificationModal Opens   │
└─────────────────────────────────────┘
    ↓
USER CLICKS:
"Send Verification Link"
    ↓
┌─────────────────────────────────────┐
│  Firebase Auth Service              │
│  sendSignInLinkToEmail()            │
└─────────────────────────────────────┘
    ↓
EMAIL SENT TO USER
(Contains verification link)
    ↓
USER OPENS EMAIL
    ↓
USER CLICKS LINK
    ↓
REDIRECTED TO APP
with verification token
    ↓
┌─────────────────────────────────────┐
│  App.tsx handles link               │
│  isSignInWithEmailLink()            │
│  signInWithEmailLink()              │
└─────────────────────────────────────┘
    ↓
EMAIL VERIFIED ✓
    ↓
FORM SHOWS:
"✓ Verified"
(Email field locked)
    ↓
USER CAN NOW SIGNUP
```

---

## 🔐 Authentication Flow (Combined)

```
┌──────────────────────────────────────────────────────────┐
│                 LOGIN PROCESS                            │
└──────────────────────────────────────────────────────────┘

ENTER EMAIL & PASSWORD
    ↓
SUBMIT FORM
    ↓
┌────────────────────────────────────────┐
│  AuthContext.tsx login()               │
│  Validates inputs                      │
└────────────────────────────────────────┘
    ↓
IS DEMO MODE?
    ├─ YES: Check localStorage
    │   ↓
    │   Find user in stored data
    │   ↓
    │   Credentials match?
    │   ├─ YES: Set currentUser → Dashboard
    │   └─ NO: Show error
    │
    └─ NO: Use Firebase
        ↓
        Is Firebase initialized?
        ├─ NO: Show config error
        │   (or fallback to demo)
        │
        └─ YES: Firebase auth
            ↓
            signInWithEmailAndPassword()
            ↓
            Get user credentials
            ↓
            Fetch user data from Firestore
            ↓
            Check userType matches
            ↓
            Set currentUser → Dashboard
```

---

## 📊 Data Structures

### User Location Data:
```typescript
{
  latitude: 28.7041,        // From GPS
  longitude: 77.1025,       // From GPS
  city: "New Delhi",        // From reverse geocoding
  state: "Delhi",           // From reverse geocoding
  region: "India"           // From reverse geocoding
}
```

### User Signup Data:
```typescript
{
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  phone: "+91-9999999999",
  college: "Delhi University",
  branch: "Computer Science",
  year: "3",
  region: "India",
  city: "New Delhi",
  state: "Delhi"
}
```

### Firebase User (post-verification):
```typescript
{
  uid: "firebase_unique_id",
  email: "john@example.com",
  displayName: "John Doe",
  emailVerified: true,
  metadata: {
    creationTime: "2024-01-22T...",
    lastSignInTime: "2024-01-22T..."
  }
}
```

---

## 🔄 Component Communication

```
App.tsx
├─ Gets: userLocation
├─ Passes to: StudentSignup
│
StudentSignup.tsx
├─ Receives: userLocation
├─ Uses: fetchLocationDetails()
├─ Updates: formData
├─ Calls: EmailLinkVerificationModal
│
EmailLinkVerificationModal.tsx
├─ Receives: email, formData
├─ Calls: Firebase sendSignInLinkToEmail()
├─ On success: onVerified() callback
│
AuthContext.tsx
├─ Manages: user state
├─ Handles: login/signup
├─ Stores: currentUser in localStorage/Firebase
├─ Returns: isAuthenticated flag
│
StudentLogin.tsx
├─ Calls: AuthContext.login()
├─ On success: Redirect to dashboard
├─ On error: Show error message
```

---

## 🌐 External Services

```
┌──────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. BROWSER GEOLOCATION API                         │
│     ├─ Gets user's GPS coordinates                  │
│     ├─ Requires HTTPS (except localhost)            │
│     └─ Requires user permission                     │
│                                                      │
│  2. OPENSTREETMAP NOMINATIM API                     │
│     ├─ Reverse geocodes coordinates → address      │
│     ├─ Free to use (no API key needed)              │
│     ├─ Rate limited (1 req/sec)                     │
│     └─ User-Agent required                          │
│                                                      │
│  3. FIREBASE AUTHENTICATION                         │
│     ├─ Email/Password authentication                │
│     ├─ Email link sign-in                           │
│     ├─ User data storage (Firestore)                │
│     └─ Requires project configuration               │
│                                                      │
│  4. FIREBASE EMAIL SERVICE                          │
│     ├─ Sends verification emails                    │
│     ├─ Included with Firebase (free tier)           │
│     ├─ Automatic unsubscribe headers                │
│     └─ Customizable email templates                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 💾 Storage Hierarchy

```
┌─────────────────────────────────────────┐
│          CLIENT STORAGE                 │
├─────────────────────────────────────────┤
│                                         │
│  localStorage                           │
│  ├─ emailForSignIn                     │
│  ├─ pendingSignupData                  │
│  ├─ thepass_demo_users (demo mode)     │
│  ├─ thepass_demo_current_user          │
│  └─ theme preference                   │
│                                         │
│  sessionStorage                         │
│  └─ (not currently used)               │
│                                         │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│        FIREBASE BACKEND                 │
├─────────────────────────────────────────┤
│                                         │
│  Authentication                         │
│  └─ User credentials (encrypted)       │
│                                         │
│  Firestore DB                           │
│  ├─ users collection                    │
│  │  └─ userData                         │
│  ├─ chats collection                    │
│  └─ profiles collection                 │
│                                         │
│  Cloud Storage                          │
│  └─ Profile pictures & files           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 State Management

```
AuthContext
├─ user: User | null
│  └─ Contains all user data
│
├─ isAuthenticated: boolean
│  └─ true if user logged in
│
├─ loading: boolean
│  └─ true while auth state initializing
│
├─ login(): Promise<boolean>
│  └─ Authenticate user
│
├─ signup(): Promise<boolean>
│  └─ Create new account
│
└─ logout(): void
   └─ Clear authentication

StudentSignup Local State
├─ formData: FormData
│  ├─ fullName, email, password
│  ├─ college, branch, year
│  └─ region, city, state
│
├─ isEmailVerified: boolean
│  └─ Email link verified
│
├─ isLoadingLocation: boolean
│  └─ Fetching GPS/reverse geocode
│
└─ locationError: string | null
   └─ Location fetch error message
```

---

## 🎯 Error Handling Flow

```
TRY ACTION
    ↓
    ├─ Success: Execute handler
    │
    └─ Error caught
        ↓
        ├─ Firebase Error?
        │  ├─ auth/invalid-email
        │  ├─ auth/user-not-found
        │  ├─ auth/wrong-password
        │  ├─ auth/too-many-requests
        │  └─ [other]
        │
        ├─ Network Error?
        │  └─ No internet connection
        │
        ├─ Geolocation Error?
        │  ├─ Permission denied
        │  ├─ Position unavailable
        │  └─ Timeout
        │
        └─ Configuration Error?
           └─ Firebase not initialized
            ↓
        SHOW USER-FRIENDLY MESSAGE
        (Specific to error type)
            ↓
        LOG DETAILED ERROR
        (To browser console)
```

---

**Last Updated:** January 22, 2026
