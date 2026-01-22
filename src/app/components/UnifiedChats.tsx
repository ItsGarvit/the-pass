import { useState } from 'react';
import { Globe, MapPin, Building2 } from 'lucide-react';
import { GlobalChat } from './GlobalChat';
import { RegionalChat } from './RegionalChat';
import { CollegeChat } from './CollegeChat';

interface UnifiedChatsProps {
  isDarkMode: boolean;
}

export function UnifiedChats({ isDarkMode }: UnifiedChatsProps) {
  const [activeChatType, setActiveChatType] = useState<'global' | 'regional' | 'college'>('global');

  return (
    <div className="h-full flex flex-col">
      {/* Chat Type Tabs */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveChatType('global')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeChatType === 'global'
                ? 'bg-blue-500 text-white shadow-md'
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </button>

          <button
            onClick={() => setActiveChatType('regional')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeChatType === 'regional'
                ? 'bg-blue-500 text-white shadow-md'
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Regional</span>
          </button>

          <button
            onClick={() => setActiveChatType('college')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeChatType === 'college'
                ? 'bg-blue-500 text-white shadow-md'
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>College</span>
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        {activeChatType === 'global' && <GlobalChat isDarkMode={isDarkMode} />}
        {activeChatType === 'regional' && <RegionalChat isDarkMode={isDarkMode} />}
        {activeChatType === 'college' && <CollegeChat isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}
