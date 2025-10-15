import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function Page() {
  return (
    <div className='flex items-center justify-center flex-col gap-10 h-screen'>
      <div className='dark:block hidden'>
        <SignIn 
        appearance={{
          baseTheme: dark
        }}
        redirectUrl="/"
        />
        </div>
        <div className='block dark:hidden'>
        <SignIn redirectUrl="/" />
        </div>
    </div>
  );
}