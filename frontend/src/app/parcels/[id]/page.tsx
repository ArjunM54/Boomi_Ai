import React from 'react';
import ParcelDetailClient from './ParcelDetailClient';

export function generateStaticParams() {
  return [
    { id: 'P-00102' },
    { id: 'TN-CBE-123456789' }
  ];
}

export default function ParcelDetailPage({ params }: { params: { id: string } }) {
  return <ParcelDetailClient id={params.id} />;
}
