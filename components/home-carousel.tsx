"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const recentPhotos = [
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80",
];

export function HomeCarousel() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Memories</h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {recentPhotos.map((photo, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <img
                    src={photo}
                    alt={`Family memory ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
}