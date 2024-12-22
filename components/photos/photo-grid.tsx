"use client";

import { useEffect, useState } from "react";
import { getPhotos } from "@/lib/photos";
import { Card } from "@/components/ui/card";
import { PhotoView } from "./photo-view";

export function PhotoGrid() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await getPhotos();
      setPhotos(data);
    };
    loadPhotos();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="cursor-pointer overflow-hidden"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative">
              <img
                src={photo.url}
                alt={photo.caption || "Family photo"}
                className="object-cover w-full h-full"
              />
            </div>
          </Card>
        ))}
      </div>
      <PhotoView
        photo={selectedPhoto}
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      />
    </>
  );
}