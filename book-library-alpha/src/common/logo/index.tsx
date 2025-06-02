import { cn } from '../../lib';

const Logo = (props: { className?: string }) => {
  const { className } = props;

  return (
    <div
      className={cn(
        'relative box-border flex justify-start items-center gap-2',
        className,
      )}
    >
      <div
        className={cn(
          'relative h-10 w-10 border-[1px] box-border border-[var(--foreground)]',
        )}
      >
        <div
          className={cn(
            'absolute h-2 bottom-2 left-[0] w-[60%] box-border bg-[var(--foreground)]',
          )}
        ></div>
        <div
          className={cn(
            'absolute h-2 bottom-0 left-0 right-0 w-full box-border bg-[var(--foreground)]',
          )}
        ></div>
      </div>
      <h1 className="text-lg font-bold text-[var(--foreground)]">
        Moneturn Book Library
      </h1>
    </div>
  );
};

export default Logo;
