import React, { useState, useRef, useEffect } from 'react';
import { verifyOTP, sendOTP } from '../../routers/ApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../constants/Page';
import { IoMdClose } from "react-icons/io";
import { ClockLoader } from 'react-spinners';

const OTPModal = ({ onClose, email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [errorOTP, setErrorOTP] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  async function handleResend() {
    setLoading(true);
    const result = await sendOTP({ email, type: 'resend' });
    if (result?.data) {
      setTimeout(() => {
        setLoading(false);
        toast.success('OTP code has been resent to your email');
      }, 2000);
    } else {
      setLoading(false);
      alert('Unexpected response from server');
    }
  }

  async function handleVerify() {
    const otpCode = otp.join('');
    if (!otpCode) {
      toast.error('OTP code cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOTP({ email, otp: otpCode });
      setTimeout(() => {
        if (response) {
          toast.success('Verify success');
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          navigate(ROUTES.RESET_PASSWORD.path, { state: { email } });
        } else {
          alert('Verify failed');
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        console.log(error);
        setLoading(false);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const message = String(error.message);
          if (message) {
            setErrorOTP(message);
            toast.error(message);
          }
        }
        setOtp(Array(6).fill(''));
      }, 2000);
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-30">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
          <div className="flex justify-center items-center w-full h-140 mt-20">
            <ClockLoader
              className="flex justify-center items-center w-full mt-20"
              color="#5EEAD4"
              cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
              }}
              loading
              speedMultiplier={3}
              size={40}
            />
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md text-center">
        <div className="text-right p-3 cursor-pointer" onClick={onClose}><IoMdClose className="rounded-3xl hover:bg-gray-500"/></div>
        <div className="pb-8 px-8">
          <h2 className="mb-4 text-lg font-semibold">
            Nhập mã OTP, mã OTP đã được gửi về mail <br/><div className="text-blue-500">{email}</div>
          </h2>
          <div className="flex justify-center mb-4 space-x-2">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 text-center border rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              onClick={handleResend}
              className="font-bold px-4 py-2 bg-sky-500 text-white rounded-2xl transition-colors duration-300 ease-in-out hover:bg-sky-600"
            >
              Gửi lại OTP
            </button>
            <button
              type="submit"
              onClick={handleVerify}
              className="font-bold px-4 py-2 bg-teal-600 text-white rounded-2xl transition-colors duration-300 ease-in-out hover:bg-teal-700"
            >
              Xác thực
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
