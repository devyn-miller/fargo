"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createMemory } from "@/lib/memories";
import { useToast } from "@/hooks/use-toast";

interface MemoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function MemoryForm({ open, onOpenChange, username }: MemoryFormProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content || !username) return;

    try {
      await createMemory(content, username);
      toast({
        title: "Success",
        description: "Memory shared successfully",
      });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share memory",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share a Memory</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="content">Your memory</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleSubmit}>Share Memory</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}