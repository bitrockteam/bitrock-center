export function Loader() {
  return (
    <div className={`flex justify-center items-center h-full w-full bg-transparent`}>
      <div
        className="relative inline-block w-12 h-12 border-4 border-foreground rounded-full box-border
    animate-[pulse-loader_1s_linear_infinite]
    after:content-['']
    after:absolute after:w-12 after:h-12 after:border-4 after:rounded-full after:inline-block
    after:box-border after:left-1/2 after:top-1/2 after:border-foreground
    after:translate-x-[-50%] after:translate-y-[-50%]
    after:animate-[scaleUp_1s_linear_infinite]
  "
      />
    </div>
  );
}
