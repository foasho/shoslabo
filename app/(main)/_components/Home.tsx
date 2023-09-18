"use client"
import dynamic from 'next/dynamic';
import { LoadingJP } from './dom/LoadingJP';

const HomeScene = dynamic(() => import('./canvas/HomeScene').then((mod) => mod.HomeScene), {
  ssr: false,
  loading: () => (
    <LoadingJP />
  ),
}) as any;

export const Home = () => {

  return (
    <>
      <HomeScene />
    </>
  )
}