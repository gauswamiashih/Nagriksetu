import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
   onUpload: (file: File) => void;
   currentImages?: string[];
   onRemove?: (index: number) => void;
}

export function ImageUpload({ onUpload, currentImages = [], onRemove }: ImageUploadProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setSelectedFile(e.target.files[0]);
      }
   };

   const handleUpload = () => {
      if (selectedFile) {
         onUpload(selectedFile);
         setSelectedFile(null);
      }
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!selectedFile}>
               <Upload className="h-4 w-4 mr-2" />
               Upload
            </Button>
         </div>

         {currentImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
               {currentImages.map((img, index) => (
                  <div key={index} className="relative group">
                     <img
                        src={img}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                     />
                     {onRemove && (
                        <button
                           onClick={() => onRemove(index)}
                           className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X className="h-3 w-3" />
                        </button>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
