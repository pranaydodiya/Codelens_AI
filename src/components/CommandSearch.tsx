import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  FolderGit2,
  FileCode,
  History,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  Code,
  Play,
} from 'lucide-react';

const pages = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { name: 'AI Code Review', href: '/reviews', icon: FileCode },
  { name: 'Review History', href: '/history', icon: History },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const aiFeatures = [
  { name: 'AI Code Summary', href: '/ai-summary', icon: Sparkles },
  { name: 'AI Code Generator', href: '/ai-generator', icon: Code },
  { name: 'API Playground', href: '/api-playground', icon: Play },
];

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const navigate = useNavigate();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, features..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => handleSelect(page.href)}
              className="cursor-pointer"
            >
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="AI Features">
          {aiFeatures.map((feature) => (
            <CommandItem
              key={feature.href}
              onSelect={() => handleSelect(feature.href)}
              className="cursor-pointer"
            >
              <feature.icon className="mr-2 h-4 w-4" />
              <span>{feature.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
