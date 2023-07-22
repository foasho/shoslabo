

const Preview = ({ html }: { html: string }) => {

  return (
    <div
      className='znc'
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  )
}

export default Preview;