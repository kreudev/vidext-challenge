'use client';

import { Editor as TldrawEditor, Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';

interface EditorProps {
  onSave: (snapshot: Record<string, any>) => void;
  onEditorMount?: (editor: TldrawEditor) => void;
}

export function Editor({ onSave, onEditorMount }: EditorProps) {
  const lastSnapshotRef = useRef<Record<string, any> | null>(null);

  const debouncedSave = useCallback(
    debounce((snapshot: Record<string, any>) => {
      if (JSON.stringify(snapshot) !== JSON.stringify(lastSnapshotRef.current)) {
        lastSnapshotRef.current = snapshot;
        onSave(snapshot);
      }
    }, 500),
    [onSave]
  );

  return (
    <Tldraw
      onMount={(editor) => {
        lastSnapshotRef.current = editor.store;
        
        if (onEditorMount) {
          onEditorMount(editor);
        }

        editor.addListener('change', () => {
          debouncedSave(editor.store);
        });
      }}
    />
  );
} 