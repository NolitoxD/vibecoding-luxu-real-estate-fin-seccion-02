'use client';

import dynamic from 'next/dynamic';

const PropertyMapClient = dynamic(() => import('./PropertyMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] rounded-lg bg-mosque/5 animate-pulse flex items-center justify-center">
      <span className="material-icons text-mosque/30 text-3xl">map</span>
    </div>
  ),
});

interface PropertyMapWrapperProps {
  lat: number;
  lng: number;
  title: string;
  location: string;
}

export default function PropertyMapWrapper(props: PropertyMapWrapperProps) {
  return <PropertyMapClient {...props} />;
}
