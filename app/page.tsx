import Image from 'next/image';
import logo from './../assets/work-order.png';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='flex flex-col items-center mt-20 '>
      <Image
        src={logo}
        alt="Logo"
        width={150}
        height={150}
      />
      <h1 className='text-3xl font-bold mt-10'>manage Task App</h1>
      <h1 className='text-3xl font-bold '>บันทึกงานที่ต้องทำ</h1>
      <Link href="alltask" className='mt-10 bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-2 px-40 rounded  '>เข้าใช้งาน</Link>
    </div>
  );
}
