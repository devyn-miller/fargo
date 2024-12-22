"use client";

import { useState, useEffect } from 'react';

export function useUsername() {
  const [username, setUsername] = useState<string>("");
  const [showNameDialog, setShowNameDialog] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem("familyMemoriesUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setShowNameDialog(false);
    }
  }, []);

  const handleSetUsername = (name: string) => {
    if (!name.trim()) return;
    localStorage.setItem("familyMemoriesUsername", name);
    setUsername(name);
    setShowNameDialog(false);
  };

  return {
    username,
    showNameDialog,
    setShowNameDialog,
    handleSetUsername,
  };
}