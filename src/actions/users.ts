"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function getUsersAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/users`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to fetch users: ${res.status} ${res.statusText} - ${errorText}`);
    throw new Error(`Failed to fetch users`);
  }

  const data = await res.json();
  return data.data || [];
}

export async function createUserAction(formData: FormData) {


  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create user: ${error}`);
  }

  revalidatePath('/dashboard/admin/users');
}

export async function updateUserAction(formData: FormData) {


  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const status = formData.get('status') as string;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (status) updateData.status = status;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update user: ${error}`);
  }

  revalidatePath('/dashboard/admin/users');
}

export async function deleteUserAction(id: string) {


  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to delete user: ${error}`);
  }

  revalidatePath('/dashboard/admin/users');
}

export async function toggleUserStatusAction(id: string, currentStatus: boolean) {


  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status: !currentStatus ? 'active' : 'suspended' }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to toggle user status: ${error}`);
  }

  revalidatePath('/dashboard/admin/users');
}