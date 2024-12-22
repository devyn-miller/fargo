"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UsernameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (username: string) => void;
}

export function UsernameDialog({ open, onOpenChange, onSubmit }: UsernameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Family Memories</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Please enter your name</Label>
            <Input
              id="name"
              placeholder="Your name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit(e.currentTarget.value);
                }
              }}
            />
          </div>
          <Button onClick={(e) => {
            const input = document.querySelector("#name") as HTMLInputElement;
            onSubmit(input.value);
          }}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}