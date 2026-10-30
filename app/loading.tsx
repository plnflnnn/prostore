import Image from "next/image";
import loader from '@/assets/loader.gif';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
        <Image src={loader} alt="Loading..." width={150} height={150} />
    </div>
  )
}

export default Loading;