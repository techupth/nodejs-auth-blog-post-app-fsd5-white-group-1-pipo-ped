import axios from "axios";

function jwtInterceptor() {
  // 🐨 Todo: Exercise #6
  //  ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
  // เมื่อมีการส่ง Request จาก Client ไปหา Server
  // ภายใน Callback Function axios.interceptors.request.use
  axios.interceptors.request.use((req) => {
    const hasToken = Boolean(window.localStorage.getItem("token"));

    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }
    return req;
  });
  // 🐨 Todo: Exercise #6
  //  ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
  // โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
  // ภายใน Error Callback Function ของ axios.interceptors.response.use
  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      //ตรวจสอบ response ว่า Token Invalid?
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }
  );
}
export default jwtInterceptor;
