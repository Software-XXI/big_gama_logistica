'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

interface Props {
  onChange: (content: string) => void;
  initialContent?: string;
}

export function BitacoraEditor({ onChange, initialContent = '' }: Props) {
  const [isSaved, setIsSaved] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'bitacora-editor',
      },
    },
    onUpdate: ({ editor }) => {
      setIsSaved(false);
      onChange(editor.getText());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const saveTimeout = setTimeout(() => {
      if (!isSaved) {
        setIsSaved(true);
      }
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  }, [isSaved, editor]);

  if (!editor) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Bitácora</h3>
        <span style={{ fontSize: 12, color: isSaved ? 'var(--success)' : 'var(--warning)' }}>
          {isSaved ? '✓ Guardado' : '⏳ Guardando...'}
        </span>
      </div>
      
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12, minHeight: 150, marginBottom: 12 }}>
        <EditorContent editor={editor} />
      </div>
      
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn btn-secondary" style={{ padding: '8px 12px', fontWeight: 'bold' }}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn btn-secondary" style={{ padding: '8px 12px', fontStyle: 'italic' }}>I</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn btn-secondary" style={{ padding: '8px 12px' }}>•</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn btn-secondary" style={{ padding: '8px 12px' }}>1.</button>
      </div>
    </div>
  );
}