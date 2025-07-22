import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key'

// Regular client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// For beta testing without Supabase, we'll use local storage
export const localStorageDB = {
  async saveConfig(config) {
    try {
      const configs = JSON.parse(localStorage.getItem('cranksmith_configs') || '[]')
      const newConfig = {
        ...config,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      configs.push(newConfig)
      localStorage.setItem('cranksmith_configs', JSON.stringify(configs))
      return { data: newConfig, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
  
  async getConfigs() {
    try {
      const configs = JSON.parse(localStorage.getItem('cranksmith_configs') || '[]')
      return { data: configs, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },
  
  async deleteConfig(id) {
    try {
      const configs = JSON.parse(localStorage.getItem('cranksmith_configs') || '[]')
      const filtered = configs.filter(c => c.id !== id)
      localStorage.setItem('cranksmith_configs', JSON.stringify(filtered))
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}