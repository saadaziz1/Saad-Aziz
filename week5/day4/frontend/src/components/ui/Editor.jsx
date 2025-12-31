import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { Bold, Italic, List, ListOrdered, Underline } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usersAPI } from '../../api/users';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import MentionList from './tip-tap/MentionList';
import { ReactRenderer } from '@tiptap/react';
import { useEffect } from 'react';

const Editor = ({ content, onChange, placeholder, disabled, className }) => {
  const customMention = Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: {
      items: async ({ query }) => {
        try {
          const response = await usersAPI.mentionSearch(query);
          return response.data?.users || response.data || [];
        } catch (error) {
          console.error('Error fetching users:', error);
          return [];
        }
      },
      render: () => {
        let component;
        let popup;

        return {
          onStart: (props) => {
            component = new ReactRenderer(MentionList, {
              props,
              editor: props.editor,
            });

            if (!props.clientRect) return;

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            });
          },
          onUpdate(props) {
            component.updateProps(props);
            if (!props.clientRect) return;
            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
          },
          onKeyDown(props) {
            if (props.event.key === 'Escape') {
              popup[0].hide();
              return true;
            }
            // Check if component and ref exist before calling onKeyDown
            if (component?.ref?.onKeyDown) {
              return component.ref.onKeyDown(props);
            }
            return false;
          },
          onExit() {
            popup[0].destroy();
            component.destroy();
          },
        };
      },
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      customMention,
    ],
    content: content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[80px] p-3 pt-0 max-w-none',
        ),
      },
    },
  });

  // Sync content updates (e.g., reset after submission)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("flex flex-col border rounded-md bg-white dark:bg-gray-900", className)}>
      {/* Static Toolbar */}
      {!disabled && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              editor.isActive('bold') ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
            )}
            title="Bold"
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              editor.isActive('italic') ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
            )}
            title="Italic"
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              editor.isActive('bulletList') ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
            )}
            title="Bullet List"
            type="button"
          >
            <List className="w-4 h-4" />
          </button>

           <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              editor.isActive('orderedList') ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
            )}
            title="Numbered List"
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} className="flex-1" />
      
      <div className="text-xs text-gray-400 p-2 text-right border-t border-gray-50 dark:border-gray-800 pointer-events-none">
        Type @ to mention
      </div>

      <style>{`
        .mention {
          background-color: rgb(219, 234, 254);
          color: rgb(30, 58, 138);
          font-weight: 600;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          box-decoration-break: clone;
        }
        .dark .mention {
           background-color: rgba(30, 58, 138, 0.5);
           color: rgb(219, 234, 254);
        }
      `}</style>
    </div>
  );
};

export default Editor;
