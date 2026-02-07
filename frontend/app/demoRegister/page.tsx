// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profession: 'ACTOR', // Default from your Enum list
    zipcode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Send data to your Spring Boot backend
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('User created successfully!');
        router.push('/home'); // Redirect to swiping home page
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Join SparkHacks Network</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" placeholder="Email" required
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <div className="flex gap-2">
          <input 
            type="text" placeholder="First Name" required
            className="w-1/2 p-2 border rounded"
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <input 
            type="text" placeholder="Last Name" required
            className="w-1/2 p-2 border rounded"
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>
        <select 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, profession: e.target.value})}
        >
          <option value="ACTOR">Actor</option>
          <option value="DIRECTOR">Director</option>
          <option value="PRODUCER">Producer</option>
          <option value="STUDIO">Studio</option>
        </select>
        <input 
          type="text" placeholder="Zipcode" required
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </div>
  );
}