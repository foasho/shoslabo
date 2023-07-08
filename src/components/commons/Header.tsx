

export const Header = () => {

  return (
    <div
      className='w-full h-20 bg-transparent flex items-center justify-center fixed z-10 top-0'
    >
      <div className='w-11/12 h-full flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='ml-2 text-gray-700 font-bold text-xl'>Sho'sLabo</div>
        </div>
        <div className='flex items-center'>
          <div className='text-gray-700 text-xl'>Work</div>
          <div className='text-gray-700 text-xl ml-4'>Design</div>
          <div className='text-gray-700 text-xl ml-4'>Contact</div>
        </div>
      </div>
    </div>
  )
}