import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center justify-center flex-col gap-10'>
        <SignIn />
    </div>
  );
}