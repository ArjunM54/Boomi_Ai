'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { HackathonDemoWizard } from '../components/HackathonDemoWizard';
import { UserRole } from '../types';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentRole, setCurrentRole] = useState<UserRole>('OFFICER');
  const [isDemoWizardOpen, setIsDemoWizardOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>BhoomiAI - AI-Powered GIS Intelligence for Smarter Land Governance</title>
        <meta name="description" content="An integrated GIS platform that combines land parcel intelligence, aerial imagery and AI-powered change detection for SIH26014." />
      </head>
      <body className="bg-bhoomi-dark text-gray-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onStartDemoWizard={() => setIsDemoWizardOpen(true)}
        />
        <div className="flex flex-1 relative">
          <Sidebar currentRole={currentRole} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
        <HackathonDemoWizard
          isOpen={isDemoWizardOpen}
          onClose={() => setIsDemoWizardOpen(false)}
        />
      </body>
    </html>
  );
}
