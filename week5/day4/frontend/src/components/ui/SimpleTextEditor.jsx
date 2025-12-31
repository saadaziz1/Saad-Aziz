import { useState } from 'react';
import { usersAPI } from '../../api/users';
import { cn } from '../../lib/utils';

const SimpleTextEditor = ({ 
  content = '', 
  onChange, 
  placeholder = 'Write your text...', 
  className = '',
  disabled = false 
}) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionUsers, setMentionUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleTextChange = async (e) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);
    
    // Check for @ mentions
    const beforeCursor = value.substring(0, cursor);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      
      if (query.length >= 1) {
        try {
          const response = await usersAPI.mentionSearch(query);
          setMentionUsers(response.data.slice(0, 5));
          setShowMentions(true);
        } catch (error) {
          console.error('Error fetching users:', error);
          setMentionUsers([]);
        }
      } else {
        setMentionUsers([]);
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
      setMentionUsers([]);
    }
    
    onChange(value);
  };

  const insertMention = (user) => {
    const beforeCursor = content.substring(0, cursorPosition);
    const afterCursor = content.substring(cursorPosition);
    const beforeMention = beforeCursor.replace(/@\w*$/, '');
    const newContent = beforeMention + `@${user.name} ` + afterCursor;
    
    onChange(newContent);
    setShowMentions(false);
    setMentionUsers([]);
  };

  return (
    <div className={cn("relative", className)}>
      <textarea
        value={content}
        onChange={handleTextChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ fontSize: '14px', lineHeight: '1.5' }}
      />
      
      {showMentions && mentionUsers.length > 0 && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
          {mentionUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => insertMention(user)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
      
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        Type @ to mention users
      </div>
    </div>
  );
};

export default SimpleTextEditor;