"use client";
import Image from "next/image";
import logo from "@/assets/work-order.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { firebasedb } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


export default function Page() {
  const router = useRouter();
 
  //สร้างตัวแปร state เพื่อผูกกับข้อมูลที่เกิดขึ้นที่หน้าจอ และบันทึกลงฐานข้อมูล
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null);
 
  //ฟังก์ชันเลือกรูปเพื่อพรีวิวก่อนที่จะอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
 
    setImageFile(file);
 
    if(file){
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }
 
  //ฟังก์ชันอัปโหลดรูปภาพ และบันทึกข้อมูลลงฐานข้อมูลที่ Supabase
  async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      //---- Validate ------
      if(title.trim() === "" || detail.trim() === ""){
        alert("กรุณาตรวจสอบการป้อนข้อมูลงานที่ทำ และรายละเอียดงาน")
        return
      }
 
      //---------- อัปโหลดรูป --------
      //โดยตรวจสอบก่อนว่าผู้ใช้ได้เลือกรูปหรือไม่ หากเลือกก็อัปโหลด หากไม่เลือกก็ไม่ต้องอัปโหลด
      //สร้างตัวแปรเพื่อเก็บ url ของรูปที่อัปโหลด เพื่อจะเอาไปบันทึกลงตาราง
      let image_url = "";
 
      //ตรวจสอบว่าได้มีการเลือกรูปเพื่อที่จะอัปโหลดหรือไม่
      if(image_file){
        //กรณีมีการเลือกรูป ก็จะทําการอัปโหลดรูปไปยัง Storage ของ Supabase
        //ตั้งชื่อไฟล์ใหม่ เพื่อไม่ให้รูปที่อัปโหลดมีชื่อซ้ํากัน
        const new_image_file_name = `${Date.now()}-${image_file.name}`;
 
        //อัปโหลดรูปไปยัง Storage
        const {data, error} = await supabase.storage
          .from("task_bk")
          .upload(new_image_file_name, image_file)
 
        //หลังจากอัปโหลดรูปไปยัง Storage ให้ตรวจสอบว่าสำเร็จหรือไม่
        //มี error แสดง Alert หากไม่มี error ให้ get url ของรูปที่อัปโหลดเก็บไว้ในตัวแปรที่สร้างไว้ image_url
        if( error ){
          //แสดง Alert
          alert("พบปัญหาในการอัปโหลด กรุณาตรวจสอบและลองใหม่อีกครั้ง")
          console.log(error.message);
          return;
        }else{
          // get url ของรูปที่
          const { data } =  supabase.storage
            .from("task_bk")
            .getPublicUrl(new_image_file_name)        
          image_url = data.publicUrl
        }
      }      
 
      //---------- บันทึกข้อมูลลงคอลเล็กชัน task ใน Firebase --------
      try{
        const result = await addDoc(collection(firebasedb, "task"),{
          title: title,
          detail: detail,
          is_completed: is_completed,
          image_url: image_url
        })
 
        if(result){
          alert("บันทึกข้อมูลสําเร็จ")
          router.push("/alltask")
        }else{
          alert('พบปัญหาในการบันทึก กรุณาตรวจสอบและลองใหม่อีกครั้ง')
        }
      }catch(error){
        alert('พบปัญหาในการบันทึก กรุณาตรวจสอบและลองใหม่อีกครั้ง')
        console.log(error);
      }
  }

  return (
    <div className="flex flex-col w-10/12 mx-auto mb-10">
      <div className="flex flex-col items-center mt-20 ">
        <Image src={logo} alt="Logo" width={100} height={100} />
        <h1 className="text-3xl font-bold mt-5">manage Task App</h1>
        <h1 className="text-3xl font-bold ">บันทึกงานที่ต้องทำ</h1>
      </div>

      <div className="w-full mx-w-lg border-2 border-gray-300 rounded-xl p-5 p-8 mt-10 space-y-6">
        <h1 className="text-xl font-bold text-center">➕ เพิ่มงานใหม่</h1>
        <form onSubmit={handleUploadAndSave} className="mt-5">
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
              onChange={handleSelectImagePreview}
            ></input>
            <label
              htmlFor="fileInput"
              className="mt-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-700 font-bold py-2 px-4 w-max rounded cursor-pointer"
            >
              เลือกไฟล์
            </label>
            {preview_file && (
              <div className="mt-3">
                <Image
                  src={preview_file}
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
              value={is_completed ? "1" : "0"}
              onChange={(e) => setIsCompleted(e.target.value === "1")}>
              <option value="0">ยังไม่เสร็จ</option>
              <option value="1">เสร็จ</option>
            </select>
          </div>

          <div className="flex justify-center ">
            <button className="mt-5 bg-emerald-500 hover:bg-emerald-700 transition-all duration-300 text-white font-bold py-2 px-4 rounded  ">
              บันทึกงาน
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-5 ">
          <Link href="/alltask" className="hover:underline text-blue-500 font-bold">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
