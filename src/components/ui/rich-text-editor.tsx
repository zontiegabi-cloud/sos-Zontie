import React, { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Check, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { FileUpload } from './file-upload';
import { MediaPicker } from '../admin/media-picker';
import { ServerFilePicker } from '../admin/server-file-picker';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const UrlInput = ({ 
  onSubmit, 
  placeholder = 'https://...' 
}: { 
  onSubmit: (url: string) => void; 
  placeholder?: string;
}) => {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url) onSubmit(url);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        className="h-8"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        autoFocus
      />
      <Button size="sm" onClick={() => handleSubmit()} className="h-8 w-8 p-0">
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [showSource, setShowSource] = useState(false);

  // Sync value to editor content
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if content is different
      if (value === '' && editorRef.current.innerHTML === '<br>') return;
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSelectionRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (selectionRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(selectionRange);
      }
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML === '<br>' ? '' : editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const addImage = (url: string) => {
    restoreSelection();
    // Wait for focus to be restored
    setTimeout(() => {
      editorRef.current?.focus();
      exec('insertImage', url);
    }, 10);
    setImagePopoverOpen(false);
    setMediaPickerOpen(false);
  };
  
  const addLink = (url: string) => {
    restoreSelection();
    setTimeout(() => {
      editorRef.current?.focus();
      exec('createLink', url);
    }, 10);
    setLinkPopoverOpen(false);
  };

  return (
    <div className={cn("border border-input rounded-md overflow-hidden bg-background", className)}>
      <MediaPicker 
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={addImage}
      />
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50 [&>button]:text-foreground [&>button:hover]:bg-accent [&>button:hover]:text-accent-foreground">
        <Button variant="ghost" size="sm" onClick={() => exec('bold')} className="h-8 w-8 p-0" title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exec('italic')} className="h-8 w-8 p-0" title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exec('underline')} className="h-8 w-8 p-0" title="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 self-center" />
        <Button variant="ghost" size="sm" onClick={() => exec('formatBlock', 'H3')} className="h-8 w-8 p-0" title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exec('formatBlock', 'H4')} className="h-8 w-8 p-0" title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 self-center" />
        <Button variant="ghost" size="sm" onClick={() => exec('insertUnorderedList')} className="h-8 w-8 p-0" title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exec('insertOrderedList')} className="h-8 w-8 p-0" title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 self-center" />
        
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add Link" onMouseDown={saveSelection}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start">
            <UrlInput onSubmit={addLink} placeholder="Enter link URL..." />
          </PopoverContent>
        </Popover>

        <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add Image" onMouseDown={saveSelection}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none rounded-t-md">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="p-3 space-y-3">
                <FileUpload 
                  onUploadComplete={addImage}
                  accept="image/*"
                  label="Upload Image"
                  variant="default"
                  className="w-full"
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-popover px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <ServerFilePicker 
                  onSelect={addImage}
                  accept="image"
                  trigger={
                    <Button variant="outline" className="w-full gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Select from Uploads</span>
                    </Button>
                  }
                />
              </TabsContent>
              <TabsContent value="url" className="p-3">
                <UrlInput onSubmit={addImage} placeholder="Enter image URL..." />
              </TabsContent>
              <TabsContent value="media" className="p-3">
                <Button 
                  onClick={() => {
                    setImagePopoverOpen(false);
                    setMediaPickerOpen(true);
                  }} 
                  variant="outline"
                  className="w-full"
                >
                  Select from Library
                </Button>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1 self-center" />
        <Button 
          variant={showSource ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setShowSource(!showSource)} 
          className="h-8 px-2" 
          title="Toggle Source Code"
        >
          <Code className="h-4 w-4 mr-1" />
          <span className="text-xs">HTML</span>
        </Button>
      </div>
      {showSource ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-background text-foreground focus:outline-none resize-y"
          placeholder="Enter HTML here..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[300px] p-4 focus:outline-none prose prose-invert max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
          data-placeholder={placeholder}
        />
      )}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: gray;
          cursor: text;
        }
      `}</style>
    </div>
  );
}
