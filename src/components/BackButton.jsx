import React from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-blue-600 text-white p-3 flex items-center shadow-md  mx-auto rounded-full mt-3 w-[200px]" >
      <FaArrowLeft className="mr-2" /> 
      <span>Back</span>
    </button>
  );
};

export default BackButton;
