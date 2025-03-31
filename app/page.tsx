'use client';

import '@tldraw/tldraw/tldraw.css';
import { trpc } from './utils/trpc';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Editor } from '@/components/Editor';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { toast } from 'sonner';
import { Editor as TldrawEditor } from '@tldraw/tldraw';
import { Dices, Plus } from 'lucide-react';
import { AIShapeInput } from '@/components/AIShapeInput';

interface Document {
  id: string;
  content: Record<string, any>;
  updatedAt: Date;
}

export default function Home() {
  const [document, setDocument] = useState<Document | null>(null);
  const utils = trpc.useUtils();
  const [shapeCounter, setShapeCounter] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<TldrawEditor | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, error, refetch } = trpc.document.getDocument.useQuery(undefined, {
    enabled: isClient
  });

  const updateDocument = trpc.document.updateDocument.useMutation({
    onSuccess: () => {
      utils.document.getDocument.invalidate();
    },
  });

  useEffect(() => {
    if (error instanceof Error) {
      toast.error("Error loading document", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (updateDocument.error instanceof Error) {
      toast.error("Error saving changes", {
        description: updateDocument.error.message,
      });
    }
  }, [updateDocument.error]);

  useEffect(() => {
    if (data) {
      setDocument({
        ...data,
        updatedAt: new Date(data.updatedAt),
      });
    }
  }, [data]);

  const handleEditorMount = useCallback((editor: TldrawEditor) => {
    editorRef.current = editor;
  }, []);

  const handleSave = useCallback((snapshot: Record<string, any>) => {
    if (JSON.stringify(snapshot) !== JSON.stringify(document?.content)) {
      const documentData = {
        id: '1',
        content: snapshot,
        updatedAt: new Date(),
      };

      setDocument({
        ...documentData,
        updatedAt: new Date(documentData.updatedAt),
      });
      updateDocument.mutate(documentData);
    }
  }, [document?.content, updateDocument]);

  const handleModifyShape = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      toast.error("Editor not available");
      return;
    }
    
    const selectedIds = editor.getSelectedShapeIds();
    const shapeIds = selectedIds.length > 0 ? selectedIds : Array.from(editor.getCurrentPageShapeIds());

    if (shapeIds.length === 0) {
      toast.error("No shapes to modify", {
        description: "Draw a shape in the editor first",
      });
      return;
    }

    const randomShapeId = shapeIds[Math.floor(Math.random() * shapeIds.length)];
    
    const colors = ['black', 'blue', 'red', 'green', 'yellow', 'orange'];
    const sizes = ['s', 'm', 'l', 'xl'];

    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSize = sizes[Math.floor(Math.random() * sizes.length)];
    const newRotation = Math.floor(Math.random() * 360);

    editor.updateShapes([
      {
        id: randomShapeId,
        type: 'geo',
        rotation: newRotation,
        props: {
          color: newColor,
          size: newSize,
        },
      },
    ]);

    toast.info("Shape modified", {
      description: `Modified shape with color ${newColor} and size ${newSize?.toUpperCase()}`,
    });
  }, []);

  const handleCreateShape = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      toast.error("Editor not available");
      return;
    }

    const shapes = ['rectangle', 'ellipse', 'triangle', 'diamond', 'star'];
    const colors = ['black', 'blue', 'red', 'green', 'yellow', 'orange'];
    const sizes = ['s', 'm', 'l', 'xl'];

    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];

    const viewport = editor.getViewportPageBounds();
    const x = viewport.x + Math.random() * (viewport.w - 100);
    const y = viewport.y + Math.random() * (viewport.h - 100);

    editor.createShapes([
      {
        type: 'geo',
        x,
        y,
        props: {
          geo: shapeType,
          color,
          size,
          w: 100,
          h: 100,
        },
      },
    ]);

    toast.success("Shape created", {
      description: `Created a ${shapeType} with color ${color} and size ${size.toUpperCase()}`,
    });
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="h-screen">
        <ErrorMessage 
          message={error.message || "Error al cargar el editor"}
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4 lg:flex justify-between items-center space-y-2 lg:space-y-0">
          <div className="flex items-center gap-2">
            {updateDocument.status === 'pending' ? (
              <div className="text-sm text-muted-foreground">
                Saving changes...
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Last saved: {document?.updatedAt.toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateShape}
                disabled={updateDocument.status === 'pending'}
                variant="outline"
                className='w-full lg:w-auto'
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Random Shape
              </Button>
              <Button 
                onClick={handleModifyShape}
                disabled={updateDocument.status === 'pending'}
                className='w-full lg:w-auto'
              >
                <Dices className="mr-2 h-4 w-4" />
                Modify Random Shape
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[600px] w-full border rounded-lg overflow-hidden mb-4">
          <Editor onSave={handleSave} onEditorMount={handleEditorMount} />
        </div>
        <AIShapeInput 
          onShapeGenerated={(shapeData) => {
            const editor = editorRef.current;
            if (!editor) {
              toast.error("Editor not available");
              return;
            }

            const viewport = editor.getViewportPageBounds();
            const x = viewport.x + (viewport.w / 2) - 50;
            const y = viewport.y + (viewport.h / 2) - 50;

            editor.createShapes([
              {
                type: shapeData.type,
                x,
                y,
                props: {
                  ...shapeData.props,
                  w: 100,
                  h: 100,
                },
              },
            ]);
          }}
          disabled={updateDocument.status === 'pending'}
        />
      </div>
    </main>
  );
}
