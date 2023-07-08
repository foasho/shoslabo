

export const Header = ({
  fontColor = '#fff',
}) => {

  return (
    <div
      className='w-full h-20 bg-transparent flex items-center justify-center fixed z-10 top-0'
      style={{
        color: fontColor,
      }}
    >
      <div className='w-11/12 h-full flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='ml-2 font-bold text-xl'>Sho&#146;sLabo</div>
        </div>
        <div className='flex items-center'>
          <div className='text-xl'>Work</div>
          <div className='text-xl ml-4'>Design</div>
          <div className='text-xl ml-4'>Contact</div>
        </div>
      </div>
    </div>
  )
}