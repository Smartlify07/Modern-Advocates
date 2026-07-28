"use client"

import { createContext, useContext } from "react"

interface AccountSessionValue {
  user: { name?: string | null; email?: string | null; image?: string | null } | undefined
  isPending: boolean
  error: Error | null
  refetchSession: () => Promise<unknown>
}

const AccountSessionContext = createContext<AccountSessionValue>({
  user: undefined,
  isPending: true,
  error: null,
  refetchSession: async () => {},
})

export function useAccountSession() {
  return useContext(AccountSessionContext)
}

export { AccountSessionContext }