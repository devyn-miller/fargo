"use client";

import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { exportData } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

export function ExportButton() {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportData();
      toast({
        title: 'Success',
        description: 'Your data has been exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Data
    </Button>
  );
}