import { supabase } from "./supabase"

/**
 * Execute SQL as admin (bypassing RLS)
 * This should only be used in admin-protected routes
 */
export async function execSqlAsAdmin(sqlQuery: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.rpc("exec_sql", { sql_query: sqlQuery })

    if (error) {
      console.error("Error executing SQL:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in execSqlAsAdmin:", error)
    return { success: false, error }
  }
}

/**
 * Check if RLS is disabled for a table
 */
export async function checkRlsStatus(tableName: string): Promise<{ disabled: boolean; error?: any }> {
  try {
    // Query to check if RLS is enabled for the table
    const { data, error } = await supabase.from("pg_tables").select("rowsecurity").eq("tablename", tableName).single()

    if (error) {
      return { disabled: false, error }
    }

    // If rowsecurity is true, RLS is enabled
    return { disabled: !data.rowsecurity }
  } catch (error) {
    return { disabled: false, error }
  }
}
