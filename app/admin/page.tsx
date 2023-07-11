'use client'

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Page = () => {

  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => signOut()}
        >
          ログアウト
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push('/admin/create')}
        >
          新規作成
        </button>
      </div>
      {/** テーブル */}
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {/** テーブルヘッダー */}
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/** タイトル */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      タイトル
                    </th>
                    {/** タグ */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      タグ
                    </th>
                    {/** 作成日時 */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      作成日時
                    </th>
                    {/** 更新日時 */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      更新日時
                    </th>
                    {/** 編集ボタン */}
                    <th
                      scope="col"
                      className="relative px-6 py-3"
                    >
                      <span className="sr-only">編集</span>
                    </th>
                    {/** 削除ボタン */}
                    <th

                      scope="col"
                      className="relative px-6 py-3"
                    >
                      <span className="sr-only">削除</span>
                    </th>
                  </tr>
                </thead>
                {/** テーブルボディ */}
                <tbody className="bg-white divide-y divide-gray-200">
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;