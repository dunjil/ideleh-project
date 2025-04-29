import { supabase } from "./supabase"

// Function to check if all required tables exist
export async function verifyDatabaseSetup() {
  try {
    // Check if the tables exist by querying them
    const requiredTables = ["events", "registrations", "gallery", "team_members"]

    // Get list of all tables in the public schema
    const { data: tableList, error: tableListError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tableListError) {
      console.error("Error checking tables:", tableListError)
      return false
    }

    // Extract table names from the result
    const existingTables = tableList?.map((t) => t.table_name) || []

    // Check if all required tables exist
    const allTablesExist = requiredTables.every((table) => existingTables.includes(table))

    return allTablesExist
  } catch (error) {
    console.error("Error verifying database setup:", error)
    return false
  }
}

// Alternative verification method using counts
export async function verifyDatabaseByCount() {
  try {
    // Try to count rows in each required table
    const tables = ["events", "registrations", "gallery", "team_members"]

    // Check each table
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("id", { count: "exact", head: true })

        if (error) {
          console.error(`Error checking table ${table}:`, error)
          return false
        }
      } catch (e) {
        console.error(`Table ${table} check failed:`, e)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error verifying database by count:", error)
    return false
  }
}

// Function to manually mark database as set up
export async function markDatabaseAsSetup() {
  try {
    // Store a flag in localStorage to indicate the database is set up
    if (typeof window !== "undefined") {
      localStorage.setItem("database_setup_complete", "true")
      return true
    }
    return false
  } catch (error) {
    console.error("Error marking database as set up:", error)
    return false
  }
}

// Function to check if database is marked as set up
export function isDatabaseMarkedAsSetup() {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("database_setup_complete") === "true"
    }
    return false
  } catch (error) {
    return false
  }
}
