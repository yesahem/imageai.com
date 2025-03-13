
import { SignIn } from '@clerk/nextjs'

export default function Signin() {
  return (
    <div className='flex justify-center items-center border-2 border-red-500 h-full'>
        <SignIn />
    </div>
  )
}