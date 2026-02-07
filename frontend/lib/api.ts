// lib/api.ts
import { User } from "@/types";

const API_BASE_URL = 'http://localhost:8080/api';

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

export async function createNewUser(userData: Partial<User>) {
  const response = await fetch('http://localhost:8080/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Could not create user');
  }

  return response.json();
}