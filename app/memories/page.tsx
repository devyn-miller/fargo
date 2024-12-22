"use client";

import { useState, useEffect } from "react";
import { useUsername } from "@/hooks/use-username";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MemoryList } from "@/components/memories/memory-list";
import { MemoryForm } from "@/components/memories/memory-form";
import { getMemories } from "@/lib/memories";

export default function MemoriesPage() {
  const { username } = useUsername();
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    const loadMemories = async () => {
      const data = await getMemories();
      setMemories(data);
    };
    loadMemories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Family Memories</h1>
        <Button onClick={() => setShowMemoryForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Share Memory
        </Button>
      </div>

      <MemoryList memories={memories} />
      <MemoryForm
        open={showMemoryForm}
        onOpenChange={setShowMemoryForm}
        username={username}
      />
    </div>
  );
}