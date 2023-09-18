"use client";
import { Layout } from '@/components/dom/Layout'
import '@/global.css';
import { RecoilRoot } from 'recoil';
import { TimeProvider } from './_providers/TimeManeger';
import { BVHPhysicsProvider } from './_providers/BVHWalkManager';

export default function MainLayout({ children }) {
  return (
    <RecoilRoot>
      <TimeProvider>
        <BVHPhysicsProvider>
          <Layout>
            {children}
          </Layout>
        </BVHPhysicsProvider>
      </TimeProvider>
    </RecoilRoot>
  )
}
