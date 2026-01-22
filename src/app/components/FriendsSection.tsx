import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Check, X, Search, Loader2, UserMinus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface FriendsSectionProps {
  isDarkMode: boolean;
}

// Helper to get all users from localStorage (demo mode)
function getAllUsers(): User[] {
  const users = localStorage.getItem('thepass_demo_users');
  return users ? JSON.parse(users) : [];
}

export function FriendsSection({ isDarkMode }: FriendsSectionProps) {
  const { user, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load all users for search
    setAllUsers(getAllUsers());
  }, []);

  if (!user) return null;

  // Get friend users
  const friendUsers = allUsers.filter(u => user.friends?.includes(u.id));
  
  // Get users who sent friend requests
  const requestUsers = allUsers.filter(u => user.friendRequests?.received.includes(u.id));
  
  // Filter users for search (exclude self, friends, and pending requests)
  const searchResults = allUsers.filter(u => {
    if (u.id === user.id) return false;
    if (user.friends?.includes(u.id)) return false;
    if (user.friendRequests?.sent.includes(u.id)) return false;
    if (user.friendRequests?.received.includes(u.id)) return false;
    
    if (!searchQuery.trim()) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query)
    );
  });

  const handleSendRequest = async (toUserId: string) => {
    setIsLoading(true);
    try {
      await sendFriendRequest(toUserId);
      toast.success('Friend request sent!');
      // Refresh users
      setAllUsers(getAllUsers());
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (fromUserId: string) => {
    setIsLoading(true);
    try {
      await acceptFriendRequest(fromUserId);
      toast.success('Friend request accepted!');
      setAllUsers(getAllUsers());
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (fromUserId: string) => {
    setIsLoading(true);
    try {
      await rejectFriendRequest(fromUserId);
      toast.success('Friend request rejected');
      setAllUsers(getAllUsers());
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    
    setIsLoading(true);
    try {
      await removeFriend(friendId);
      toast.success('Friend removed');
      setAllUsers(getAllUsers());
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove friend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Friends</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your friends and friend requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'friends'
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Friends ({friendUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Requests ({requestUsers.length})
          {requestUsers.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {requestUsers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('find')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'find'
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Search className="w-4 h-4" />
          Find Friends
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Friends List */}
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Your Friends</h3>
            {friendUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No friends yet. Start by finding and adding friends!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {friendUsers.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {friend.photoURL ? (
                        <img
                          src={friend.photoURL}
                          alt={friend.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {friend.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{friend.fullName}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {friend.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      disabled={isLoading}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Friend Requests</h3>
            {requestUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No pending friend requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requestUsers.map((requester) => (
                  <div
                    key={requester.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {requester.photoURL ? (
                        <img
                          src={requester.photoURL}
                          alt={requester.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {requester.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{requester.fullName}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {requester.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(requester.id)}
                        disabled={isLoading}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(requester.id)}
                        disabled={isLoading}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Find Friends */}
        {activeTab === 'find' && (
          <motion.div
            key="find"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}
          >
            <h3 className="font-bold text-lg mb-4">Find Friends</h3>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } focus:border-blue-500 outline-none transition-colors`}
              />
            </div>

            {/* Search Results */}
            {searchQuery.trim() === '' ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Start typing to search for users
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No users found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((foundUser) => (
                  <div
                    key={foundUser.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {foundUser.photoURL ? (
                        <img
                          src={foundUser.photoURL}
                          alt={foundUser.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {foundUser.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{foundUser.fullName}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {foundUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(foundUser.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
