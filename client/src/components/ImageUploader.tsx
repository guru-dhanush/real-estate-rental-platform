"use client";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { X } from "lucide-react";
import Image from "next/image";

registerPlugin(FilePondPluginImagePreview);

interface ImageUploaderProps {
  existingImages: string[];
  newImages: File[];
  onDelete: (url: string) => void;
  onNewImages: (files: File[]) => void;
}

export const ImageUploader = ({
  existingImages,
  newImages,
  onDelete,
  onNewImages,
}: ImageUploaderProps) => {
  return (
    <div className="space-y-4">
      {/* Existing images with delete option */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {existingImages.map((url, index) => (
            <div key={index} className="relative group">
              <Image
                width={100}
                height={100}
                src={url}
                alt={`Property image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onDelete(url)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File upload for new images */}
      <FilePond
        files={newImages}
        onupdatefiles={(fileItems) => {
          const files = fileItems.map(fileItem => fileItem.file);
          onNewImages(files);
        }}
        allowMultiple={true}
        maxFiles={10 - existingImages.length}
        name="photos"
        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        credits={false}
        acceptedFileTypes={["image/*"]}
      />
    </div>
  );
};