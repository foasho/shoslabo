"use client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaDiscord } from "react-icons/fa";

const MySwal = withReactContent(Swal);

export const Community = () => {

  const openCommunity = () => {
    // TODO: Open community
    MySwal.fire({
      title: (
        <div className="text-left">
          <FaDiscord className='inline-block text-3xl text-[#7289da]' />
          <span className='ml-2 text-2xl'>Dicsordコミュニティ</span>
          <div>
            <span className='text-xl font-bold'>
              朝活フロントエンド
            </span>
          </div>
          <div className="text-left">
            <span className='text-sm'>
              毎週月曜日の07:00〜09:00にReactThreeFiber勉強会と
              <br/>
              毎週木曜日の20:00〜22:00にGLSL勉強会を
              <br/>
              Discord内で開催しています。
            </span>
            <div className='mt-2 text-sm'>
              <a className="text-[#7289da] underline" target='_blank' href='https://discord.gg/CdjXp66MHP'>
                参加はこちらのリンクからどうぞ！
              </a>
            </div>
          </div>
        </div>
      ),
      confirmButtonText: 'OK'
    })
  };

  return (
    <span onClick={() => openCommunity()}>
      Community
    </span>
  )
}