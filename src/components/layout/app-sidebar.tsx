
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List, BrainCircuit, Folder } from 'lucide-react';

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
  const isProjectPage = pathname.startsWith('/projects/');
  const isDashboard = pathname.startsWith('/dashboard');

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
            <SidebarMenuButton asChild isActive={isDashboard} className="text-base" tooltip="Projects">
              <Link href="/dashboard">
                <Folder />
                {state === 'expanded' && <span>Projects</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isProjectPage && (
            <>
            <SidebarSeparator/>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.endsWith('/board')} className="text-base" tooltip="Board">
                  <Link href={`${pathname.substring(0, pathname.lastIndexOf('/'))}/board`}>
                    <LayoutGrid />
                    {state === 'expanded' && <span>Board</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.endsWith('/list')} className="text-base" tooltip="List">
                  <Link href={`${pathname.substring(0, pathname.lastIndexOf('/'))}/list`}>
                    <List />
                    {state === 'expanded' && <span>List</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
