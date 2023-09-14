"use client"
import dynamic from 'next/dynamic';
import { LoadingJP } from './LoadingJP';

const HomeScene = dynamic(() => import('./R3F/HomeScene').then((mod) => mod.HomeScene), {
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