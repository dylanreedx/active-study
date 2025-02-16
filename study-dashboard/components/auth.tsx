'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AuthProps = {
  onAuthenticated: (phoneNumber: string) => void;
};

export function Auth({onAuthenticated}: AuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (storedPhoneNumber) {
      checkVerificationStatus(storedPhoneNumber);
    }
  }, []);

  const checkVerificationStatus = async (phoneNumber: string) => {
    try {
      const response = await fetch(
        `/api/check-verified?phoneNumber=${phoneNumber}`
      );
      const data = await response.json();
      if (data.verified) {
        onAuthenticated(phoneNumber);
      } else {
        setPhoneNumber(phoneNumber);
        setStep('code');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleSendVerification = async () => {
    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phoneNumber}),
      });

      if (response.ok) {
        setStep('code');
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phoneNumber, code: verificationCode}),
      });

      if (response.ok) {
        localStorage.setItem('phoneNumber', phoneNumber);
        onAuthenticated(phoneNumber);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to verify code');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Account</CardTitle>
        <CardDescription>
          Enter your phone number to connect to your study account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'phone' ? (
          <div className='space-y-4'>
            <Input
              type='tel'
              placeholder='Enter your phone number'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button onClick={handleSendVerification}>
              Send Verification Code
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <Input
              type='text'
              placeholder='Enter verification code'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button onClick={handleVerifyCode}>Verify Code</Button>
          </div>
        )}
        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </CardContent>
    </Card>
  );
}
