import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes';

export default function Page() {
  return (
    <div className='flex items-center justify-center flex-col gap-10 h-screen'>
      <div className='dark:block hidden'>
        <SignUp 
        appearance={{
          baseTheme: dark
        }}
        />
        </div>
        <div className='block dark:hidden'>
        <SignUp />
        </div>
    </div>
  );
}