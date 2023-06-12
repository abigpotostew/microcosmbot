type FrameBlockProps = { children: React.ReactNode; classes?: string }

const FrameBlock: React.FC<FrameBlockProps> = ({
  children,
  classes,
  ...rest
}) => {
  const borderOffset = (i: number, negative?: boolean, start: number = 2) =>
    `${negative ? '-' : ''}${(start + 2 * i) / 16}rem`

  return (
    <div
      className={`relative z-10 ml-2px mr-2 mb-2 ${classes ?? ''}`}
      {...rest}
    >
      <>
        {children}
        <span className="absolute top-0 left-0 border-t-2 w-full border-gray-900"></span>
        <span className="absolute top-2px -left-2px h-full border-l-2 border-gray-900"></span>
        {Array.from(new Array(4)).map((_, i) => (
          <span
            key={`border-r-${i}`}
            className="absolute h-full border-r-2 border-gray-900"
            style={{ top: borderOffset(i), right: borderOffset(i, true) }}
          ></span>
        ))}
        {Array.from(new Array(4)).map((_, i) => (
          <span
            key={`border-b-${i}`}
            className="absolute w-full border-b-2 border-gray-900"
            style={{
              bottom: borderOffset(i, true),
              left: borderOffset(i, false, 0),
            }}
          ></span>
        ))}
      </>
    </div>
  )
}

export default FrameBlock
