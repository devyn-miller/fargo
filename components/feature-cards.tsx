"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Latest Photos",
    description: "Browse through our latest family photos and create new albums.",
    href: "/photos",
  },
  {
    title: "Upcoming Events",
    description: "Stay updated with family gatherings and celebrations.",
    href: "/events",
  },
  {
    title: "Family Tree",
    description: "Explore and contribute to our family history.",
    href: "/family-tree",
  },
];

export function FeatureCards() {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <Card key={feature.title} className="p-6">
          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground mb-4">{feature.description}</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href={feature.href}>View {feature.title}</Link>
          </Button>
        </Card>
      ))}
    </section>
  );
}