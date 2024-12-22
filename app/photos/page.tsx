"use client";

import { useState } from "react";
import { useUsername } from "@/hooks/use-username";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { PhotoUpload } from "@/components/photos/photo-upload";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PhotosPage() {
  const { username } = useUsername();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Family Photos</h1>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Photos
        </Button>
      </div>

      <PhotoGrid />
      <PhotoUpload
        open={showUpload}
        onOpenChange={setShowUpload}
        username={username}
      />
    </div>
  );
}