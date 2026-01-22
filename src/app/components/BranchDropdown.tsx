import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { getBranchesByCollege, searchBranches } from '../data/branchesData';

interface BranchDropdownProps {
  college: string;
  value: string;
  onChange: (branch: string) => void;
  disabled?: boolean;
}

export function BranchDropdown({ college, value, onChange, disabled }: BranchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update available branches when college changes
  useEffect(() => {
    if (college) {
      const branches = getBranchesByCollege(college);
      setAvailableBranches(branches);
    } else {
      setAvailableBranches([]);
    }
  }, [college]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBranches = searchBranches(availableBranches, searchQuery);

  const handleSelect = (branch: string) => {
    onChange(branch);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && college && setIsOpen(!isOpen)}
        disabled={disabled || !college}
        className={`w-full px-4 py-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
          disabled || !college
            ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gray-50 dark:bg-gray-700 border-gray-900 dark:border-gray-100 hover:border-purple-500 dark:hover:border-purple-400'
        }`}
      >
        <span className={value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
          {value || 'Select Branch'}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 rounded-2xl shadow-2xl max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Branches List */}
          <div className="overflow-y-auto max-h-60">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(branch)}
                  className={`w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors ${
                    value === branch ? 'bg-purple-50 dark:bg-purple-900/20 font-semibold' : ''
                  }`}
                >
                  <span className="text-gray-900 dark:text-gray-100">{branch}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No branches found' : 'No branches available'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!college && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Please select a college first to see available branches
        </p>
      )}
    </div>
  );
}
