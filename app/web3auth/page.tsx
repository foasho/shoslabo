'use client';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react'
import useConnectWallet from '@/templates/hooks/useConnectWallet';
import ClientOnly from '@/client-only';
import Swal from 'sweetalert2';

export default function WalletConnect() {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const { data: session } = useSession();
  const { connect, isConnected, handleLogin, isInstalledMetamask } = useConnectWallet({ callbackUrl: "/web3auth" });

  const updateAccount = async () => {
    if (email) {
      // 値チェックEmailアドレスが正しいかどうか
      if (!email.match(/.+@.+\..+/)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'メールアドレスが正しくありません!',
        })
        return;
      }
    }
    const d = {};
    if (name) {
      d['name'] = name;
    }
    if (email) {
      d['email'] = email;
    }
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(d),
    });
    const json = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'アカウント情報を更新しました',
      });
    }
    return json;
  }

  return (
    <ClientOnly>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-[350px]">
          <h1 className="text-3xl font-bold mb-6">Web3Auth</h1>
          {!isInstalledMetamask &&
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              className="text-blue-500 hover:text-blue-700"
            >
              Install Metamask
            </a>
          }
          {isInstalledMetamask &&
            <>
              {!session ?
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isConnected) {
                      connect();
                    } else {
                      handleLogin();
                    }
                  }}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ease-in-out duration-200 mb-6"
                >
                  Connect Wallet
                </button>
                :
                <>
                  <div>
                    <img
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                      src={session?.user?.image as string}
                      alt={session?.user?.name as string}
                     />
                  </div>
                  <input 
                    className="w-full bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-500 rounded py-2 px-4 mb-4"
                    type="text"
                    placeholder="Name"
                    defaultValue={session?.user?.name as string}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e: any) => {
                      // Enterキーで更新
                      if (e.key == "Enter"){
                        updateAccount();
                      }
                    }}
                  />
                  <input 
                    className="w-full bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-500 rounded py-2 px-4 mb-4"
                    type="email"
                    placeholder="Email"
                    defaultValue={session?.user?.email as string}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e: any) => {
                      // Enterキーで更新
                      if (e.key == "Enter") {
                        updateAccount();
                      }
                    }}
                  />
                  <div>
                    {/** アップデートボタン */}
                    <button
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ease-in-out duration-200 mb-2"
                      onClick={() => updateAccount()}
                    >
                      更新する
                    </button>
                    {/** ログアウトボタン */}
                    <button
                      className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors ease-in-out duration-200"
                      onClick={() => signOut()}>
                      ログアウト
                    </button>
                  </div>
                </>
              }
            </>
          }
        </div>
      </div>
    </ClientOnly>
  );
}