import Image from "next/image";
import loader from '@/assets/loader.gif';

const Loading = () => {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Image
          src={loader}
          alt="Loading..."
          width={150}
          height={150}
          className="h-auto w-[150px]"
        />
    </div>
  )
}

export default Loading;