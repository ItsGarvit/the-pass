# 🎨 Visual User Flow Guide

## 📱 Student Signup User Flow (Visual)

```
┌─────────────────────────────────────┐
│      STUDENT SIGNUP PAGE            │
│                                     │
│  [Back Button]                      │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Student Registration        │  │
│  │   Join The Pass               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Browser Prompt:                    │
│  ┌─────────────────────────────────┐│
│  │ Allow access to your location?  ││
│  │  [Allow]   [Deny]               ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
         ↓                    ↓
      [Allow]              [Deny]
        ↓                    ↓
```

### Flow 1: With Location Permission (Allow)

```
┌──────────────────────────────────┐
│ 📍 Fetching location details...  │
│                                  │
│ [Loading spinner]                │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ ✓ Location auto-filled from GPS  │
│                                  │
│ Detected: New Delhi, Delhi, India│
│ [🔄 Refresh Location]            │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Full Name         [editable]     │
│ Email            [Verify] button │
│ Password         [editable]      │
│ Phone            [editable]      │
│ College          [editable]      │
│ Branch           [editable]      │
│ Year             [editable]      │
│                                  │
│ Region           [New Delhi ✏️]   │
│ City             [Delhi ✏️]       │
│ State            [Delhi ✏️]       │
│                                  │
│ [Create Account]                 │
│                                  │
│ Already have account? [Login]    │
└──────────────────────────────────┘
```

### Flow 2: Without Location Permission (Deny)

```
┌──────────────────────────────────┐
│ ❌ We couldn't detect location   │
│                                  │
│ [🔄 Try Again]                   │
│ Or enter location manually below  │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Region           [empty ✏️]       │
│ City             [empty ✏️]       │
│ State            [empty ✏️]       │
│                                  │
│ User enters manually              │
└──────────────────────────────────┘
```

---

## 📧 Email Verification Flow (Visual)

```
USER FILLS SIGNUP FORM
│
│ Full Name:     John Doe
│ Email:         john@example.com [Verify ✓]
│ Password:      ••••••••••
│ Location:      Auto-filled or manual
│
└──► CLICKS [Verify] Button
     │
     └──► MODAL OPENS:
         ┌─────────────────────────────────┐
         │   Verify Your Email             │
         │                                 │
         │   📧 icon                       │
         │                                 │
         │   We'll send a verification     │
         │   link to:                      │
         │   john@example.com              │
         │                                 │
         │   [Send Verification Link]      │
         │                                 │
         │   [Close X]                     │
         └─────────────────────────────────┘
              │
              └──► FIREBASE SENDS EMAIL
                   │
                   └──► USER RECEIVES EMAIL:
                        ┌──────────────────────┐
                        │ Sign in to ThePass   │
                        │                      │
                        │ Click link to verify:│
                        │ https://thepass.app/ │
                        │ verify-email?...     │
                        │ [Click Here]         │
                        └──────────────────────┘
                             │
                             └──► USER CLICKS LINK
                                  │
                                  └──► EMAIL VERIFIED ✓
                                       │
                                       └──► MODAL UPDATES:
                                            ┌──────────────────┐
                                            │ Check Your Email!│
                                            │                  │
                                            │ ✅ icon          │
                                            │                  │
                                            │ We sent link to: │
                                            │ john@...         │
                                            │                  │
                                            │ Next step: Open  │
                                            │ email & click    │
                                            │ verification link│
                                            │                  │
                                            │ [Didn't get it?  │
                                            │  Send Again]     │
                                            └──────────────────┘
                                                 │
                                                 └──► USER CLOSES MODAL
                                                      │
                                                      └──► EMAIL FIELD SHOWS:
                                                           john@example.com ✓
                                                           (Verified)
                                                           │
                                                           └──► USER CAN NOW
                                                                CLICK [Create Account]
```

---

## 🎯 Location Editing Flow (Visual)

```
LOCATION AUTO-FILLED:
┌────────────────────────────────┐
│ Region: India         [✏️edit] │
│ City:   New Delhi     [✏️edit] │
│ State:  Delhi         [✏️edit] │
└────────────────────────────────┘
         │
         └──► USER CLICKS FIELD
              │
              ├──► DELETE TEXT
              │    └──► Type new location
              │         │
              │         └──► City: Bangalore
              │              State: Karnataka
              │              Region: South India
              │
              └──► FORM UPDATES
                   │
                   └──► College dropdown
                        loads from new state
```

---

## 🔐 Login Flow (Visual)

```
┌──────────────────────────────┐
│   Student Login              │
│                              │
│   Email:    [john@...]   📧  │
│   Password: [••••••••••]  🔒 │
│   Remember: ☐               │
│                              │
│   [Forgot password?]         │
│                              │
│   [Login to Dashboard]       │
│                              │
│   Don't have account?        │
│   [Sign up as a student]     │
└──────────────────────────────┘
         │
         └──► CLICK [Login to Dashboard]
              │
              ├──► VALIDATION:
              │    ✓ Email not empty?
              │    ✓ Email valid format?
              │    ✓ Password not empty?
              │    ✓ Password 6+ chars?
              │
              └──► FIREBASE AUTH:
                   │
                   ├─ Success: ✅ Login
                   │  │
                   │  └──► REDIRECT TO DASHBOARD
                   │
                   └─ Error: ❌
                      │
                      ├─ Invalid email/password
                      ├─ Account doesn't exist
                      ├─ Email not verified
                      └─ Too many attempts
```

---

## 📊 Status Indicators (Visual)

### Location Status:

```
LOADING:
┌────────────────────────────┐
│ 📍 Fetching your location  │
│     [spinner] ...          │
└────────────────────────────┘

SUCCESS:
┌────────────────────────────┐
│ ✓ Location auto-filled     │
│ Detected: City, State      │
│ [🔄 Refresh] [Edit fields] │
└────────────────────────────┘

ERROR:
┌────────────────────────────┐
│ ❌ Couldn't detect location│
│ [🔄 Try Again]             │
│ Enter manually below        │
└────────────────────────────┘

MANUAL ENTRY:
┌────────────────────────────┐
│ 📍 Enable location access  │
│ [📍 Enable Location Access]│
│ Or enter manually below     │
└────────────────────────────┘
```

### Email Status:

```
NOT VERIFIED:
[your@email.com]   [Verify]

VERIFYING:
Email verification in progress...
[spinner] Sending link...

VERIFIED:
✓ your@email.com ✓
(Status shows as verified - green checkmark)
Email field is now locked
```

---

## 🎬 Complete User Journey (Timeline)

```
TIME    EVENT                        USER ACTION
────────────────────────────────────────────────────────────
T=0     App loads                    User opens app
        Browser prompt appears        User clicks "Allow"
T=1s    Location detected            (Automatic)
        Address reverse-geocoded      (Automatic)
        Form auto-fills              (Automatic)
T=2s    Signup form visible          User sees green status
        Location: Auto-filled ✓      
T=5s    User fills name, email       User types info
T=10s   User clicks Verify           Email modal opens
T=11s   Sends verification link      "Link sent" message
T=20s   User opens email app         (External)
        Finds verification email     User receives email
T=25s   User clicks link in email    Email link
        Redirected back to app       App verifies
T=26s   Modal closes                 Email shows ✓
        Verified status shows        Green checkmark
T=30s   User clicks Create Account   Form submitted
T=31s   Account created in Firebase  User account stored
        Dashboard loads             Redirects to dashboard
T=40s   User logged in              Dashboard visible
```

---

## 🎨 Color Scheme (Visual)

```
SUCCESS STATE (GREEN):
┌─────────────────────────────────────┐
│ ✓ Location auto-filled from GPS     │
│                                     │
│ Detected: New Delhi, Delhi, India   │
│ [🔄 Refresh Location]               │
└─────────────────────────────────────┘
Background: #F0FDF4 (light green)
Border: #22C55E (green)
Text: #166534 (dark green)

ERROR STATE (RED):
┌─────────────────────────────────────┐
│ ❌ We couldn't detect your location │
│                                     │
│ [🔄 Try Again]                      │
└─────────────────────────────────────┘
Background: #FEF2F2 (light red)
Border: #EF4444 (red)
Text: #991B1B (dark red)

INFO STATE (BLUE):
┌─────────────────────────────────────┐
│ 📍 Fetching your location details   │
│                                     │
│ [spinner] Loading...                │
└─────────────────────────────────────┘
Background: #EFF6FF (light blue)
Border: #60A5FA (blue)
Text: #1E40AF (dark blue)

PENDING STATE (AMBER):
┌─────────────────────────────────────┐
│ 📍 Auto-detect your location        │
│                                     │
│ [📍 Enable Location Access]         │
│ Or enter your details manually      │
└─────────────────────────────────────┘
Background: #FFFBEB (light amber)
Border: #F59E0B (amber)
Text: #92400E (dark amber)
```

---

**Last Updated:** January 22, 2026
