// Mock Supabase client for demonstration
// Returns empty data for all queries to prevent errors

class QueryBuilder {
  constructor(private tableName: string) {}

  select(columns = "*") {
    return {
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
      }),
      in: (column: string, values: any[]) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
    }
  }

  insert(data: any) {
    return {
      select: () => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback),
    }
  }

  update(data: any) {
    return {
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback),
    }
  }

  delete() {
    return {
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback),
    }
  }
}

export function createClient() {
  return {
    from: (tableName: string) => new QueryBuilder(tableName),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: (credentials: any) => Promise.resolve({ data: null, error: null }),
      signUp: (credentials: any) => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ data: null, error: null }),
    },
  }
}
