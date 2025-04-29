import { supabase } from "./supabase"

/**
 * Bypass RLS for admin operations by using the admin_insert function
 * This function will insert data into a table with SECURITY DEFINER privileges
 */
export async function adminInsert(tableName: string, data: any) {
  try {
    const { data: result, error } = await supabase.rpc("admin_insert", {
      table_name: tableName,
      data: data,
    })

    if (error) {
      console.error(`Error in adminInsert for table ${tableName}:`, error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error(`Exception in adminInsert for table ${tableName}:`, error)
    return { success: false, error }
  }
}

/**
 * Disable RLS for a specific table
 */
export async function disableRlsForTable(tableName: string) {
  try {
    const { error } = await supabase.rpc("disable_rls_for_table", {
      table_name: tableName,
    })

    if (error) {
      console.error(`Error disabling RLS for table ${tableName}:`, error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error(`Exception disabling RLS for table ${tableName}:`, error)
    return { success: false, error }
  }
}
