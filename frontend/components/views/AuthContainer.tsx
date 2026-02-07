import React from 'react';
import { InputField } from '../shared/InputField';

interface AuthContainerProps {
  type: 'login' | 'signup';
  onSuccess: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ type, onSuccess }) => {
  const isLogin = type === 'login';

  return (
    <div className="flex flex-col w-full animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="p-10 bg-gradient-to-br from-red-600 to-red-900 text-white text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-3xl font-black tracking-tighter">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm opacity-80 mt-2">
          {isLogin ? 'Sign in to your professional network' : 'Join the leading entertainment community'}
        </p>
      </div>

      {/* Form Area */}
      <div className="p-10 space-y-6 bg-black">
        {!isLogin && (
          <div className="flex gap-4">
            <InputField label="First Name" placeholder="John" />
            <InputField label="Last Name" placeholder="Doe" />
          </div>
        )}
        
        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="name@studio.com" 
          autoComplete="email"
        />
        
        <InputField 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          autoComplete="current-password"
        />

        {!isLogin && (
          <InputField label="Zip Code" placeholder="90210" />
        )}

        <button 
          onClick={onSuccess} 
          className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] mt-4"
        >
          {isLogin ? 'Login' : 'Get Started'}
        </button>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="ml-2 text-red-500 font-bold hover:underline"
              onClick={() => {/* Implement switch logic if needed */}}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};