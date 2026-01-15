"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useEffect, useRef } from 'react'; // Added useRef

const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef(null); // Reference for the hidden file input

  if (!editor) return null;

  // --- Image Upload Logic ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (optional: limit to 2MB for Base64)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please upload an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // --- Link Logic ---
  const setLink = () => {
    const url = linkUrl.trim();
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-md sticky top-0 z-20">
        {/* Basic Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
        >
          <em>I</em>
        </button>
        
        <div className="w-px bg-gray-300 mx-1 my-2"></div>

        {/* IMAGE UPLOAD BUTTON */}
        <button
          type="button"
          onClick={triggerFileInput}
          className="p-2 rounded hover:bg-gray-200 flex items-center gap-1 text-blue-600 font-medium"
          title="Upload Image from Computer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Upload</span>
        </button>

        {/* CODE BLOCK BUTTON */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-black text-white' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>

        <div className="w-px bg-gray-300 mx-1 my-2"></div>

        {/* Link Button */}
        <button
          type="button"
          onClick={() => editor.isActive('link') ? editor.chain().focus().unsetLink().run() : setShowLinkInput(true)}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <div className="w-px bg-gray-300 mx-1 my-2"></div>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}>• List</button>
      </div>

      {/* Link Modal */}
      {showLinkInput && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 left-4">
          <input
            type="text"
            placeholder="URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-64 mb-2 block"
            autoFocus
          />
          <div className="flex gap-2">
            <button type="button" onClick={setLink} className="bg-blue-600 text-white px-3 py-2 rounded text-sm flex-1">Save</button>
            <button type="button" onClick={() => setShowLinkInput(false)} className="bg-gray-200 px-3 py-2 rounded text-sm flex-1">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg shadow-md my-6 block mx-auto' },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: { class: 'bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-4 overflow-x-auto' },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6 bg-white',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!mounted || !editor) return <div className="p-4 bg-gray-50 border rounded text-center">Loading Editor...</div>;

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden relative shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[400px] overflow-y-auto" />
    </div>
  );
}