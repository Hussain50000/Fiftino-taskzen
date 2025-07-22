
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List, BrainCircuit } from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20">
                <BrainCircuit className="text-primary" />
            </Button>
            {state === 'expanded' && <h1 className="text-xl font-semibold">Fiftino TaskZen</h1>}
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'} className="text-base" tooltip="Board">
              <Link href="/">
                <LayoutGrid />
                {state === 'expanded' && <span>Board</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/list'} className="text-base" tooltip="List">
              <Link href="/list">
                <List />
                {state === 'expanded' && <span>List</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
