"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface PhotoViewProps {
  photo: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoView({ photo, open, onOpenChange }: PhotoViewProps) {
  if (!photo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="relative aspect-[4/3]">
          <img
            src={photo.url}
            alt={photo.caption || "Family photo"}
            className="object-contain w-full h-full"
          />
        </div>
        {photo.caption && (
          <p className="text-center text-muted-foreground mt-2">
            {photo.caption}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}