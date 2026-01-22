# 🎯 Quick Reference Guide

## ⚡ Quick Start

### For Development:

```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:5173
# 3. Navigate to Student Signup
# 4. Grant location permission when asked
# 5. Fill form and verify email
# 6. Sign up complete!
```

### For Testing:

```
Location Testing:
✓ Allow permission → Location should auto-fill
✓ Deny permission → Show manual entry option
✓ Edit fields → Should be editable
✓ Refresh location → Should update coordinates

Email Testing:
✓ Click Verify → Modal appears
✓ Send link → Email received in 5 min
✓ Click link → Verified status shows
✓ Signup → Account created in Firebase
```

---

## 📊 Critical Settings

### Firebase Console:
- **Authentication → Sign-in method**: Email/Password = **ENABLED** ✓
- **Authentication → Settings → Authorized domains**: Add your domain
- **Environment variables**: All VITE_FIREBASE_* set in `.env`

### App Configuration:
- **src/app/config/firebase.ts**: `USE_DEMO_MODE = false` (for Firebase)
- **Environment**: Browser must support Geolocation API

---

## 🔍 Debugging Quick Tips

### Location Not Detecting?
1. Check browser console: `✓ Location detected: ...`
2. Allow location permission when prompted
3. Try "📍 Enable Location Access" button
4. Verify browser supports geolocation

### Email Not Sending?
1. Check console for error code
2. Verify Email/Password auth enabled in Firebase
3. Check spam folder for email
4. Look for "❌ Firebase not initialized" error
5. Verify `.env` has correct Firebase keys

### Login Failing?
1. Check console: `❌ Login error:` message
2. Verify account created (check Firebase Console)
3. Confirm email is verified
4. Check password is correct (6+ chars)

---

## 🎬 Console Log Quick Reference

| Log | Meaning |
|-----|---------|
| `✓ Location detected` | GPS working |
| `❌ Geolocation permission denied` | User said no to location |
| `📧 Preparing to send verification` | Email about to send |
| `✅ Verification email sent` | Email sent to inbox |
| `✉️ Email verification link detected` | User clicked email link |
| `✅ Email verified successfully` | Email confirmed |
| `❌ Login error: Firebase: Error` | Authentication failed |
| `🎭 Running in DEMO MODE` | Using localStorage, not Firebase |

---

## 📱 File Map

| What | Where |
|------|-------|
| Location detection | `App.tsx` |
| Email verification | `EmailLinkVerificationModal.tsx` |
| Login logic | `AuthContext.tsx` |
| Firebase config | `firebase.ts` |
| Signup form | `StudentSignup.tsx` |
| Email setup | `EMAIL_AUTHENTICATION_SETUP.md` |

---

## ✅ Quick Checklist

Before going live:
- [ ] Location permission works
- [ ] Email verification works
- [ ] Login succeeds after verification
- [ ] Error messages are clear
- [ ] Console logs are visible
- [ ] Firebase auth enabled
- [ ] `.env` configured correctly
- [ ] No syntax errors (`npm run build`)

---

## 🆘 Emergency Fixes

### If nothing works:
```typescript
// Temporary: Switch to demo mode
// In src/app/config/firebase.ts
export const USE_DEMO_MODE = true; // Change to true

// This uses localStorage instead of Firebase
// Users can signup/login without internet
```

### To verify Firebase:
```javascript
// In browser console:
firebase.auth().currentUser // Should show user if logged in
firebase.auth().signOut() // Sign out
```

---

## 📞 Support Commands

```bash
# Check for errors
npm run build

# Run tests (if available)
npm run test

# Dev server with logging
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎓 Learning Resources

- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **OpenStreetMap**: https://nominatim.org/
- **React**: https://react.dev

---

## 🎯 Next Milestones

1. ✅ **Phase 1**: Location detection + Email verification (DONE)
2. ⏳ **Phase 2**: Profile picture upload + Privacy controls
3. ⏳ **Phase 3**: Friends system + Direct chat
4. ⏳ **Phase 4**: Advanced features

---

**Last Updated:** January 22, 2026
**Status:** ✅ Ready to Test
