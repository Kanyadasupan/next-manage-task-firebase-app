"use client";
import Image from "next/image";
import logo from "@/assets/work-order.png";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";



export default function Page() {
 const id = useParams().id;
const router = useRouter();

//ดึงข้อมูลจาก supabase เพื่อผูกกับข้อมูลที่เกิดขึ้น และบันทึกลงฐานข้อมูล
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_Completed, setIsCompleted] = useState<boolean>(false);
  const [image_File, setImageFile] = useState<File | null>(null);
  const [preview_File, setPreviewFile] = useState<string | null>(null);
  const [old_image_file, setOldImageFile] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      
    }
    fetchData();
  }, [id]);

//เลือกรูปภาพและแสดงตัวอย่างรูปภาพ
  function handleSelecImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFile(file);
    if (file) {
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }

//อัพโหลดรูปภาพและบันทึกแก้ไขข้อมูลลงฐานข้อมูลfirebase
  async function handleUplodeAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    
  }
  

  return (
    <div className="flex flex-col w-10/12 mx-auto mb-10">
      <div className="flex flex-col items-center mt-10 ">
        <Image src={logo} alt="Logo" width={100} height={100} />
        <h1 className="text-3xl font-bold mt-5">manage Task App</h1>
        <h1 className="text-3xl font-bold ">บันทึกงานที่ต้องทำ</h1>
      </div>

      <div className="w-full mx-w-lg border-2 border-gray-300 rounded-xl p-5 p-8 mt-10 space-y-6">
        <h1 className="text-xl font-bold text-center">✏️ แก้ไขงาน</h1>
        <form onSubmit={handleUplodeAndUpdate} className="mt-5">
          <div className="mt-5 flex flex-col ">
            <label className="text-xl font-bold ">งานที่ทำ</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-blue-400"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            ></input>
          </div>

          <div className="mt-5 flex flex-col ">
            <label className="text-xl font-bold ">รายละเอียดงาน</label>
            <textarea
              className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-blue-400"
              rows={4}
              onChange={(e) => setDetail(e.target.value)}
              value={detail}
            ></textarea>
          </div>

          <div className="mt-5 flex flex-col ">
            <label className="text-xl font-bold ">อับโหลดรูปภาพ</label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/"
              onChange={handleSelecImagePreview}
            ></input>
            <label
              htmlFor="fileInput"
              className="mt-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-700 font-bold py-2 px-4 w-max rounded cursor-pointer"
            >
              เลือกไฟล์
            </label>
            {preview_File && (
              <div className="mt-3">
                <Image
                  src={preview_File}
                  alt="Preview"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xl font-bold " htmlFor="status">
              สถานะงาน
            </label>
            <select className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-blue-400 w-full "
              value={is_Completed ? "1" : "0"}
              onChange={(e) => setIsCompleted(e.target.value === "1")}>
              <option value="0">ยังไม่เสร็จ</option>
              <option value="1">เสร็จ</option>
            </select>
          </div>

          <div className="flex justify-center ">
            <button className="mt-5 bg-emerald-500 hover:bg-emerald-700 transition-all duration-300 text-white font-bold py-2 px-4 rounded  ">
              บันทึกแก้ไข
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-5 ">
          <Link href="/" className="hover:underline text-blue-500 font-bold">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
