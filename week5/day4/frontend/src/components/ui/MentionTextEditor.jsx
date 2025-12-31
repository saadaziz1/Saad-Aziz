import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { useState, useCallback, useEffect } from 'react';
import { usersAPI } from '../../api/users';
import { cn } from '../../lib/utils';
import { createRoot } from 'react-dom/client';

const MentionList = ({ items, command, range }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback((index) => {
    const item = items[index];
    if (item) {
      command({ id: item._id, label: item.name });
    }
  }, [command, items]);

  const onKeyDown = useCallback(({ event }) => {
    if (event.key === 'ArrowUp') {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
      return true;
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex((selectedIndex + 1) % items.length);
      return true;
    }

    if (event.key === 'Enter') {
      selectItem(selectedIndex);
      return true;
    }

    return false;
  }, [selectedIndex, items.length, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  return {
    onKeyDown,
    component: (
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-1 max-h-40 overflow-y-auto z-50">
        {items.length ? (
          items.map((item, index) => (
            <button
              key={item._id}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => selectItem(index)}
            >
              {item.name}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
        )}
      </div>
    )
  };
};

const MentionTextEditor = ({ 
  content = '', 
  onChange, 
  placeholder = 'Type @ to mention users...', 
  className = '',
  disabled = false 
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention bg-blue-100 text-blue-800 px-1 rounded dark:bg-blue-900 dark:text-blue-200',
          'data-type': 'mention',
        },
        suggestion: {
          items: async ({ query }) => {
            if (query.length < 1) return [];
            try {
              const response = await usersAPI.mentionSearch(query);
              return response.data.slice(0, 5);
            } catch (error) {
              console.error('Error fetching users:', error);
              return [];
            }
          },
          render: () => {
            let reactRenderer;
            let popup;

            return {
              onStart: (props) => {
                popup = document.createElement('div');
                popup.className = 'mention-popup fixed z-50';
                document.body.appendChild(popup);
                
                const mentionList = MentionList(props);
                reactRenderer = createRoot(popup);
                reactRenderer.render(mentionList.component);
                
                popup._onKeyDown = mentionList.onKeyDown;
              },
              onUpdate(props) {
                const mentionList = MentionList(props);
                reactRenderer.render(mentionList.component);
                popup._onKeyDown = mentionList.onKeyDown;
              },
              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  return false;
                }
                return popup._onKeyDown?.(props) || false;
              },
              onExit() {
                if (popup) {
                  reactRenderer?.unmount();
                  popup.remove();
                }
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setIsEmpty(text.trim().length === 0);
      onChange?.(html);
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[60px] p-3 border-0',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      const text = editor.getText();
      setIsEmpty(text.trim().length === 0);
    }
  }, [content, editor]);

  return (
    <div className={cn("relative border rounded-md bg-white dark:bg-gray-900 min-h-[80px]", className)}>
      <EditorContent 
        editor={editor} 
        className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:outline-none"
      />
      {isEmpty && (
        <div className="absolute top-3 left-3 text-gray-400 pointer-events-none text-sm">
          {placeholder}
        </div>
      )}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        Type @ to mention
      </div>
    </div>
  );
};

export default MentionTextEditor;