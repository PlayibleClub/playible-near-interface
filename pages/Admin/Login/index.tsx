import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAdmin } from 'redux/admin/adminSlice';
const AdminLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const userLogin = async () => {
    console.log('test');
    console.log(process.env.ADMIN);
    console.log(process.env.ADMIN2);
    if (userName === process.env.ADMIN && password === process.env.ADMIN2) {
      console.log('test');
      dispatch(setIsAdmin(true));
      router.push('/Admin/Game');
    }
  };
  return (
    <div className="flex flex-col h-screen flex-wrap ">
      <div className="flex justify-center mt-6 mb-8 h-12 w-screen"> </div>
      <div className="flex justify-center mt-12 w-screen">
        {/* <Image
          className=""
          src="/images/promotionheader.png"
          alt="Playible Logo"
          width={256}
          height={59}
        ></Image> */}
      </div>
      <div className="flex justify-center mt-12 w-screen"></div>
      <div className="flex justify-center mt-4 w-screen">
        <div className="flex flex-col overflow-auto flex-wrap w-3/12 h-96 border-2 px-4 shadow-2xl  bg-white rounded-xl">
          <div className="flex text-black w-full pl-2 h-8 mt-8 ">Username</div>
          <input
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Type your username"
            className="flex text-black  border-gray-500 overflow-auto border-b-2 h-12 p-2 w-full"
          ></input>
          <div className="flex text-black w-full pl-2 h-8 mt-4 ">Password</div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Type your password"
            className="flex text-black  border-gray-500  overflow-auto border-b-2 h-12 p-2 w-full"
          ></input>
          <div className="flex h-12 mt-12 w-full justify-center">
            <button
              onClick={userLogin}
              className="flex text-black w-1/2 border-2 border-indigo-500 bg-indigo-500 rounded-full justify-center pt-2 "
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
