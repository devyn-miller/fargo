"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhoto } from "@/lib/photos";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function PhotoUpload({ open, onOpenChange, username }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file || !username) return;

    try {
      await uploadPhoto(file, username);
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="photo">Choose photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}