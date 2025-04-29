import { supabase } from "./supabase"

// Function to get the current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Error getting user:", error)
    return null
  }

  return user
}

// Function to check if a user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

// Function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return false
  }

  return true
}

// Function to get the current session
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error)
    return null
  }

  return session
}
