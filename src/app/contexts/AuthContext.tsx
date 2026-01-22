import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, USE_DEMO_MODE } from '../config/firebase';

export type UserType = 'student' | 'mentor' | 'company' | 'college';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  fullName: string;
  
  // Verification fields (for mentor, company, college)
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
  
  // Student specific fields
  phone?: string;
  college?: string;
  collegeVerified?: boolean;
  branch?: string;
  year?: string;
  region?: string;
  city?: string;
  state?: string;
  
  // Mentor specific fields
  jobTitle?: string;
  company?: string;
  experience?: string;
  expertise?: string[];
  highestQualification?: string;
  linkedIn?: string;
  bio?: string;
  
  // Company specific fields
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  companyDescription?: string;
  contactPerson?: string;
  
  // College specific fields
  collegeName?: string;
  collegeType?: string;
  accreditation?: string;
  location?: string;
  collegeDescription?: string;
  
  // Profile picture
  photoURL?: string;
  photoPrivacy?: 'public' | 'friends'; // Default: 'public'
  
  // Friends system
  friends?: string[]; // Array of user IDs
  friendRequests?: {
    sent: string[];     // Pending requests sent
    received: string[]; // Pending requests received
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  signup: (userData: any, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  updateUserId: (newId: string) => Promise<boolean>;
  updateCollege: (college: string) => Promise<boolean>;
  updateProfilePicture: (photoURL: string) => Promise<boolean>;
  updatePhotoPrivacy: (privacy: 'public' | 'friends') => Promise<boolean>;
  sendFriendRequest: (toUserId: string) => Promise<boolean>;
  acceptFriendRequest: (fromUserId: string) => Promise<boolean>;
  rejectFriendRequest: (fromUserId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode helpers (localStorage-based)
const DEMO_USERS_KEY = 'thepass_demo_users';
const DEMO_CURRENT_USER_KEY = 'thepass_demo_current_user';

function getDemoUsers(): User[] {
  const users = localStorage.getItem(DEMO_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function generateStudentId(fullName: string): string {
  const namePart = fullName.replace(/\s+/g, '').toLowerCase();
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `${namePart}${randomNumber}`;
}

function saveDemoUser(user: User) {
  const users = getDemoUsers();
  users.push(user);
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getDemoCurrentUser(): User | null {
  const user = localStorage.getItem(DEMO_CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setDemoCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(DEMO_CURRENT_USER_KEY);
  }
}

function findDemoUser(email: string, password: string): User | null {
  const users = getDemoUsers();
  const hashedPassword = btoa(password);
  return users.find(u => u.email === email && (u as any).password === hashedPassword) || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_DEMO_MODE) {
      const currentUser = getDemoCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    } else {
      if (auth) {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                setUser(userData);
                setIsAuthenticated(true);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const signup = async (userData: any, password: string, userType: UserType): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        const users = getDemoUsers();
        
        if (users.some(u => u.email === userData.email)) {
          throw new Error('Email already registered');
        }

        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters');
        }

        // Generate ID based on user type
        let newId: string;
        if (userType === 'student') {
          newId = generateStudentId(userData.fullName);
        } else {
          newId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Create user object based on type
        let newUser: User;
        
        if (userType === 'student') {
          newUser = {
            id: newId,
            email: userData.email,
            userType,
            fullName: userData.fullName,
            phone: userData.phone,
            college: userData.college,
            collegeVerified: true,
            branch: userData.branch,
            year: userData.year,
            region: userData.region,
            city: userData.city,
            state: userData.state,
          };
        } else if (userType === 'mentor') {
          newUser = {
            id: newId,
            email: userData.email,
            userType,
            fullName: userData.fullName,
            phone: userData.phone,
            jobTitle: userData.jobTitle,
            company: userData.company,
            experience: userData.experience,
            expertise: userData.expertise,
            highestQualification: userData.highestQualification,
            linkedIn: userData.linkedIn,
            bio: userData.bio,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else if (userType === 'company') {
          newUser = {
            id: newId,
            email: userData.email,
            userType,
            fullName: userData.contactPerson || userData.fullName,
            companyName: userData.companyName,
            industry: userData.industry,
            companySize: userData.companySize,
            website: userData.website,
            phone: userData.phone,
            companyDescription: userData.companyDescription,
            contactPerson: userData.contactPerson,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else if (userType === 'college') {
          newUser = {
            id: newId,
            email: userData.email,
            userType,
            fullName: userData.contactPerson || userData.fullName,
            collegeName: userData.collegeName,
            collegeType: userData.collegeType,
            accreditation: userData.accreditation,
            location: userData.location,
            city: userData.city,
            state: userData.state,
            phone: userData.phone,
            collegeDescription: userData.collegeDescription,
            contactPerson: userData.contactPerson,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else {
          throw new Error('Invalid user type');
        }

        (newUser as any).password = btoa(password);
        saveDemoUser(newUser);
        setDemoCurrentUser(newUser);
        setUser(newUser);
        setIsAuthenticated(true);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          password
        );

        // Create user object based on type
        let newUser: User;
        
        if (userType === 'student') {
          newUser = {
            id: userCredential.user.uid,
            email: userData.email,
            userType,
            fullName: userData.fullName,
            phone: userData.phone,
            college: userData.college,
            collegeVerified: true,
            branch: userData.branch,
            year: userData.year,
            region: userData.region,
            city: userData.city,
            state: userData.state,
          };
        } else if (userType === 'mentor') {
          newUser = {
            id: userCredential.user.uid,
            email: userData.email,
            userType,
            fullName: userData.fullName,
            phone: userData.phone,
            jobTitle: userData.jobTitle,
            company: userData.company,
            experience: userData.experience,
            expertise: userData.expertise,
            highestQualification: userData.highestQualification,
            linkedIn: userData.linkedIn,
            bio: userData.bio,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else if (userType === 'company') {
          newUser = {
            id: userCredential.user.uid,
            email: userData.email,
            userType,
            fullName: userData.contactPerson || userData.fullName,
            companyName: userData.companyName,
            industry: userData.industry,
            companySize: userData.companySize,
            website: userData.website,
            phone: userData.phone,
            companyDescription: userData.companyDescription,
            contactPerson: userData.contactPerson,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else if (userType === 'college') {
          newUser = {
            id: userCredential.user.uid,
            email: userData.email,
            userType,
            fullName: userData.contactPerson || userData.fullName,
            collegeName: userData.collegeName,
            collegeType: userData.collegeType,
            accreditation: userData.accreditation,
            location: userData.location,
            city: userData.city,
            state: userData.state,
            phone: userData.phone,
            collegeDescription: userData.collegeDescription,
            contactPerson: userData.contactPerson,
            isVerified: false,
            verificationStatus: 'pending',
          };
        } else {
          throw new Error('Invalid user type');
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        setUser(newUser);
        setIsAuthenticated(true);

        return true;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        const demoUser = findDemoUser(email, password);
        
        if (!demoUser) {
          throw new Error('Invalid email or password');
        }

        if (demoUser.userType !== userType) {
          throw new Error(`This account is registered as a ${demoUser.userType}. Please use the correct login page.`);
        }

        setDemoCurrentUser(demoUser);
        setUser(demoUser);
        setIsAuthenticated(true);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }

        const userData = userDoc.data() as User;

        if (userData.userType !== userType) {
          await signOut(auth);
          throw new Error(`This account is registered as a ${userData.userType}. Please use the correct login page.`);
        }

        setUser(userData);
        setIsAuthenticated(true);

        return true;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many login attempts. Please try again later.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (USE_DEMO_MODE) {
        setDemoCurrentUser(null);
      } else {
        if (auth) {
          await signOut(auth);
        }
      }
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserId = async (newId: string): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          id: newId
        };

        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured. Please set up Firebase or enable demo mode.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          id: newId
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update user ID error:', error);
      throw error;
    }
  };

  const updateCollege = async (college: string): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          college,
          collegeVerified: true
        };

        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          college,
          collegeVerified: true
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update college error:', error);
      throw error;
    }
  };

  const updateProfilePicture = async (photoURL: string): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          photoURL
        };

        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          photoURL
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update profile picture error:', error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        if (!user) {
          throw new Error('User not found');
        }

        const users = getDemoUsers();
        const updatedUsers = users.filter(u => u.email !== user.email);
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(updatedUsers));

        setDemoCurrentUser(null);
        setUser(null);
        setIsAuthenticated(false);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        const currentUser = auth.currentUser;
        if (!currentUser || !user) {
          throw new Error('User not found');
        }

        await deleteDoc(doc(db, 'users', user.id));
        await deleteUser(currentUser);

        setUser(null);
        setIsAuthenticated(false);

        return true;
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const updatePhotoPrivacy = async (privacy: 'public' | 'friends'): Promise<boolean> => {
    try {
      if (USE_DEMO_MODE) {
        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          photoPrivacy: privacy
        };

        const users = getDemoUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          const passwordField = (users[userIndex] as any).password;
          users[userIndex] = { ...updatedUser, password: passwordField } as any;
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        }

        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser: User = {
          ...user,
          photoPrivacy: privacy
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Update photo privacy error:', error);
      throw error;
    }
  };

  const sendFriendRequest = async (toUserId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (user.id === toUserId) {
        throw new Error('Cannot send friend request to yourself');
      }

      if (user.friends?.includes(toUserId)) {
        throw new Error('Already friends with this user');
      }

      if (user.friendRequests?.sent.includes(toUserId)) {
        throw new Error('Friend request already sent');
      }

      if (USE_DEMO_MODE) {
        const users = getDemoUsers();
        const targetUserIndex = users.findIndex(u => u.id === toUserId);
        
        if (targetUserIndex === -1) {
          throw new Error('User not found');
        }

        // Update current user's sent requests
        const updatedUser: User = {
          ...user,
          friendRequests: {
            sent: [...(user.friendRequests?.sent || []), toUserId],
            received: user.friendRequests?.received || []
          }
        };

        // Update target user's received requests
        const targetUser = users[targetUserIndex];
        const updatedTargetUser: User = {
          ...targetUser,
          friendRequests: {
            sent: targetUser.friendRequests?.sent || [],
            received: [...(targetUser.friendRequests?.received || []), user.id]
          }
        };

        // Save both users
        const currentUserIndex = users.findIndex(u => u.email === user.email);
        if (currentUserIndex !== -1) {
          const passwordField = (users[currentUserIndex] as any).password;
          users[currentUserIndex] = { ...updatedUser, password: passwordField } as any;
        }

        const targetPasswordField = (users[targetUserIndex] as any).password;
        users[targetUserIndex] = { ...updatedTargetUser, password: targetPasswordField } as any;
        
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        // Similar Firebase implementation
        const updatedUser: User = {
          ...user,
          friendRequests: {
            sent: [...(user.friendRequests?.sent || []), toUserId],
            received: user.friendRequests?.received || []
          }
        };

        const targetUserDoc = await getDoc(doc(db, 'users', toUserId));
        if (!targetUserDoc.exists()) {
          throw new Error('User not found');
        }

        const targetUser = targetUserDoc.data() as User;
        const updatedTargetUser: User = {
          ...targetUser,
          friendRequests: {
            sent: targetUser.friendRequests?.sent || [],
            received: [...(targetUser.friendRequests?.received || []), user.id]
          }
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        await setDoc(doc(db, 'users', toUserId), updatedTargetUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Send friend request error:', error);
      throw error;
    }
  };

  const acceptFriendRequest = async (fromUserId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.friendRequests?.received.includes(fromUserId)) {
        throw new Error('No friend request from this user');
      }

      if (USE_DEMO_MODE) {
        const users = getDemoUsers();
        const fromUserIndex = users.findIndex(u => u.id === fromUserId);
        
        if (fromUserIndex === -1) {
          throw new Error('User not found');
        }

        // Update current user: remove from received, add to friends
        const updatedUser: User = {
          ...user,
          friends: [...(user.friends || []), fromUserId],
          friendRequests: {
            sent: user.friendRequests?.sent || [],
            received: user.friendRequests?.received.filter(id => id !== fromUserId) || []
          }
        };

        // Update from user: remove from sent, add to friends
        const fromUser = users[fromUserIndex];
        const updatedFromUser: User = {
          ...fromUser,
          friends: [...(fromUser.friends || []), user.id],
          friendRequests: {
            sent: fromUser.friendRequests?.sent.filter(id => id !== user.id) || [],
            received: fromUser.friendRequests?.received || []
          }
        };

        // Save both users
        const currentUserIndex = users.findIndex(u => u.email === user.email);
        if (currentUserIndex !== -1) {
          const passwordField = (users[currentUserIndex] as any).password;
          users[currentUserIndex] = { ...updatedUser, password: passwordField } as any;
        }

        const fromPasswordField = (users[fromUserIndex] as any).password;
        users[fromUserIndex] = { ...updatedFromUser, password: fromPasswordField } as any;
        
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        const updatedUser: User = {
          ...user,
          friends: [...(user.friends || []), fromUserId],
          friendRequests: {
            sent: user.friendRequests?.sent || [],
            received: user.friendRequests?.received.filter(id => id !== fromUserId) || []
          }
        };

        const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
        if (!fromUserDoc.exists()) {
          throw new Error('User not found');
        }

        const fromUser = fromUserDoc.data() as User;
        const updatedFromUser: User = {
          ...fromUser,
          friends: [...(fromUser.friends || []), user.id],
          friendRequests: {
            sent: fromUser.friendRequests?.sent.filter(id => id !== user.id) || [],
            received: fromUser.friendRequests?.received || []
          }
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        await setDoc(doc(db, 'users', fromUserId), updatedFromUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Accept friend request error:', error);
      throw error;
    }
  };

  const rejectFriendRequest = async (fromUserId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.friendRequests?.received.includes(fromUserId)) {
        throw new Error('No friend request from this user');
      }

      if (USE_DEMO_MODE) {
        const users = getDemoUsers();
        const fromUserIndex = users.findIndex(u => u.id === fromUserId);
        
        if (fromUserIndex === -1) {
          throw new Error('User not found');
        }

        // Update current user: remove from received
        const updatedUser: User = {
          ...user,
          friendRequests: {
            sent: user.friendRequests?.sent || [],
            received: user.friendRequests?.received.filter(id => id !== fromUserId) || []
          }
        };

        // Update from user: remove from sent
        const fromUser = users[fromUserIndex];
        const updatedFromUser: User = {
          ...fromUser,
          friendRequests: {
            sent: fromUser.friendRequests?.sent.filter(id => id !== user.id) || [],
            received: fromUser.friendRequests?.received || []
          }
        };

        // Save both users
        const currentUserIndex = users.findIndex(u => u.email === user.email);
        if (currentUserIndex !== -1) {
          const passwordField = (users[currentUserIndex] as any).password;
          users[currentUserIndex] = { ...updatedUser, password: passwordField } as any;
        }

        const fromPasswordField = (users[fromUserIndex] as any).password;
        users[fromUserIndex] = { ...updatedFromUser, password: fromPasswordField } as any;
        
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        const updatedUser: User = {
          ...user,
          friendRequests: {
            sent: user.friendRequests?.sent || [],
            received: user.friendRequests?.received.filter(id => id !== fromUserId) || []
          }
        };

        const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
        if (!fromUserDoc.exists()) {
          throw new Error('User not found');
        }

        const fromUser = fromUserDoc.data() as User;
        const updatedFromUser: User = {
          ...fromUser,
          friendRequests: {
            sent: fromUser.friendRequests?.sent.filter(id => id !== user.id) || [],
            received: fromUser.friendRequests?.received || []
          }
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        await setDoc(doc(db, 'users', fromUserId), updatedFromUser);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Reject friend request error:', error);
      throw error;
    }
  };

  const removeFriend = async (friendId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.friends?.includes(friendId)) {
        throw new Error('Not friends with this user');
      }

      if (USE_DEMO_MODE) {
        const users = getDemoUsers();
        const friendIndex = users.findIndex(u => u.id === friendId);
        
        if (friendIndex === -1) {
          throw new Error('User not found');
        }

        // Update current user: remove from friends
        const updatedUser: User = {
          ...user,
          friends: user.friends.filter(id => id !== friendId)
        };

        // Update friend: remove current user from friends
        const friend = users[friendIndex];
        const updatedFriend: User = {
          ...friend,
          friends: friend.friends?.filter(id => id !== user.id) || []
        };

        // Save both users
        const currentUserIndex = users.findIndex(u => u.email === user.email);
        if (currentUserIndex !== -1) {
          const passwordField = (users[currentUserIndex] as any).password;
          users[currentUserIndex] = { ...updatedUser, password: passwordField } as any;
        }

        const friendPasswordField = (users[friendIndex] as any).password;
        users[friendIndex] = { ...updatedFriend, password: friendPasswordField } as any;
        
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
        setDemoCurrentUser(updatedUser);
        setUser(updatedUser);

        return true;
      } else {
        if (!auth || !db) {
          throw new Error('Firebase is not configured.');
        }

        const updatedUser: User = {
          ...user,
          friends: user.friends.filter(id => id !== friendId)
        };

        const friendDoc = await getDoc(doc(db, 'users', friendId));
        if (!friendDoc.exists()) {
          throw new Error('User not found');
        }

        const friend = friendDoc.data() as User;
        const updatedFriend: User = {
          ...friend,
          friends: friend.friends?.filter(id => id !== user.id) || []
        };

        await setDoc(doc(db, 'users', user.id), updatedUser);
        await setDoc(doc(db, 'users', friendId), updatedFriend);
        setUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error('Remove friend error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUserId, 
      updateCollege, 
      updateProfilePicture, 
      updatePhotoPrivacy,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      deleteAccount, 
      isAuthenticated, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof window !== 'undefined' && (window as any).__REACT_REFRESH__) {
      return {
        user: null,
        login: async () => false,
        signup: async () => false,
        logout: () => {},
        updateUserId: async () => false,
        updateCollege: async () => false,
        updateProfilePicture: async () => false,
        updatePhotoPrivacy: async () => false,
        sendFriendRequest: async () => false,
        acceptFriendRequest: async () => false,
        rejectFriendRequest: async () => false,
        removeFriend: async () => false,
        deleteAccount: async () => false,
        isAuthenticated: false,
        loading: true
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}