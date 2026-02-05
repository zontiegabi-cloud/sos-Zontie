import { useState, useRef } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  className?: string;
  label?: string;
  currentValue?: string;
  variant?: 'default' | 'button';
}

export function FileUpload({ 
  onUploadComplete, 
  accept = "image/*,video/*", 
  className,
  label = "Upload File",
  currentValue,
  variant = 'default'
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Always try to upload to server if we have a URL
      if (API_BASE_URL) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onUploadComplete(data.url);
          toast.success('File uploaded successfully');
          return;
        } else {
           console.warn('Server upload failed, falling back to local base64');
        }
      }

      // Fallback to Base64 (Data URL) for offline/demo mode
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUploadComplete(base64String);
        toast.success('File uploaded successfully (Local)');
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearValue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUploadComplete('');
  };

  if (variant === 'button') {
    return (
      <div className={className}>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={accept}
          onChange={handleFileChange}
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title={label}
        >
           {isUploading ? (
             <Loader2 className="w-4 h-4 animate-spin" />
           ) : (
             <Upload className="w-4 h-4" />
           )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div 
        className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[150px]"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={accept}
          onChange={handleFileChange}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : currentValue ? (
          <div className="relative w-full animate-in fade-in zoom-in duration-300">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full"
              onClick={clearValue}
            >
              <X className="w-3 h-3" />
            </Button>
            
            {currentValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || currentValue.startsWith('data:image/') ? (
              <img 
                src={currentValue} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded-md object-contain shadow-sm" 
              />
            ) : currentValue.match(/\.(mp4|webm|mov)$/i) || currentValue.startsWith('data:video/') ? (
              <video 
                src={currentValue} 
                className="max-h-48 mx-auto rounded-md shadow-sm" 
                controls 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <File className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px] font-mono bg-background px-2 py-1 rounded border">{currentValue.split('/').pop()}</span>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: {accept === "image/*" ? "Images" : accept === "video/*" ? "Videos" : "Images & Videos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
