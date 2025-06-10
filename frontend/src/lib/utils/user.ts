import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updateUserData(newData: Partial<any>) {
  try {
    // Get current user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const currentUser = JSON.parse(userData);
    
    // Update user data with new values
    const updatedUser = {
      ...currentUser,
      ...newData
    };

    // Save back to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Dispatch a custom event to notify components about the update
    const event = new CustomEvent('userDataUpdated', { detail: updatedUser });
    window.dispatchEvent(event);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user data:', error);
    return null;
  }
} 