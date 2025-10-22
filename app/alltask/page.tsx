"use client";

import Image from "next/image";
import logo from "@/assets/work-order.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { firebasedb } from "@/lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

//สร้างประเภทตัวแปลเพื่อเก็บข้อมูลที่ดึงมาจาก firebase
type Task = {
  id: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  created_at: string;
  update_at: string;
};

export default function Page() {
  //สร้างตัวแปล state เพื่อเก็บข้อมูล task ที่ดึงมาจาก Supabase
  const [tasks, setTasks] = useState<Task[]>([]);
  //เมื่อเพจถูกโหลด ให้ดึงข้อมูลจาก Supabase เพื่อมาแสดง
  useEffect(() => {
    async function fetchTasks() {
      const result =await getDocs(collection(firebasedb, "task"));
      
      setTasks(result.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        detail: doc.data().detail,
        is_completed: doc.data().is_completed,
        image_url: doc.data().image_url,
        created_at: doc.data().created_at,
        update_at: doc.data().update_at,
      })));
    }
    fetchTasks();
  }, []);

  //สร้างฟังก์ชันสำหรับลบข้อมูลออกจากcolection firebase
  async function handleDeleteTaskClick(id: string, image_url: string) {
    //แสดงconfirm dialogเพื่อให้ผู้ใช้ยืนยันการลบข้อมูล
    if (confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) {

      //ลบรูปออกจาก stroage (ถ้ามีรูป)
      
      //ลบข้อมูลออกจากcolection firebase
      

      //ตรวจสอบ error
    }
      
  }
  return (
    <div className="flex flex-col w-10/12 mx-auto">
      <div className="flex flex-col items-center mt-20 ">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-3xl font-bold mt-10">manage Task App Firebase</h1>
        <h1 className="text-3xl font-bold ">บันทึกงานที่ต้องทำ</h1>
      </div>
      <div className="flex justify-end ">
        <Link
          href="addtask"
          className="mt-10 bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-2 px-2 rounded "
        >
          เพิ่มงาน
        </Link>
      </div>

      <div className="mt-5 ">
        <table className="min-w-full border border-black text-sm text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black p-2">รูป</th>
              <th className="border border-black p-2">งานที่ต้องทำ</th>
              <th className="border border-black p-2">รายละเอียด</th>
              <th className="border border-black p-2">สถานะ</th>
              <th className="border border-black p-2">วันที่เพิ่ม</th>
              <th className="border border-black p-2">วันที่แก้ไข</th>
              <th className="border border-black p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="text-center">
                <td className="border border-black p-2">
                  {task.image_url ? (
                    <Image
                      src={task.image_url}
                      alt="logo"
                      width={50}
                      height={50}
                      className="mx-auto"
                    />
                  ) : (
                    "ไม่มีรูป"
                  )}
                </td>
                <td className="border border-black p-2">{task.title}</td>
                <td className="border border-black p-2">{task.detail}</td>
                <td className="border border-black p-2">
                  {task.is_completed ? (
                    <span className="text-green-500">เสร็จ</span>
                  ) : (
                    <span className="text-red-500">ยังไม่เสร็จ</span>
                  )}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.created_at).toLocaleString()}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.update_at).toLocaleString()}
                </td>
                <td className="border border-black p-2 ">
                  <Link
                    href={`/edittask/${task.id}`}
                    className="text-yellow-400 hover:text-amber-500 transition-all duration-300 mr-2 font-bold"
                  >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteTaskClick(task.id, task.image_url)
                    }
                    className="text-red-500 rounded hover:text-red-700 transition-all duration-300 cursor-pointer font-bold"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center p-10 ">
          <Link href="/" className="hover:underline text-blue-500 font-bold">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
