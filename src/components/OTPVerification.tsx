
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  mobile: string;
  onVerified: () => void;
  onCancel: () => void;
}

const OTPVerification = ({ mobile, onVerified, onCancel }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  
  // Generate and "send" OTP when component mounts
  useEffect(() => {
    generateAndSendOTP();
  }, []);
  
  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const generateAndSendOTP = () => {
    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setIsResending(true);
    
    // In a real app, this would be an API call to send the OTP
    // For demo purposes, we'll show it in the console and a toast
    console.log(`OTP sent to ${mobile}: ${newOtp}`);
    
    setTimeout(() => {
      toast.success(`OTP sent to ${mobile}`);
      setIsResending(false);
      setCountdown(60);
    }, 1500);
  };
  
  const handleVerify = () => {
    if (otp === generatedOtp) {
      toast.success("Mobile number verified successfully!");
      onVerified();
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };
  
  const handleResendOTP = () => {
    if (!isResending && countdown === 0) {
      generateAndSendOTP();
    }
  };
  
  return (
    <div className="p-6 rounded-lg bg-white shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Verify Your Mobile Number</h2>
      <p className="text-gray-600 mb-6 text-center">
        We've sent a verification code to {mobile}.<br />
        Please enter the code below.
      </p>
      
      <div className="flex justify-center mb-6">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button onClick={handleVerify} disabled={otp.length !== 6} className="w-full">
          Verify OTP
        </Button>
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleResendOTP}
            disabled={isResending || countdown > 0}
            className="text-primary"
          >
            {isResending
              ? "Sending..."
              : countdown > 0
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
          </Button>
        </div>
        
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
