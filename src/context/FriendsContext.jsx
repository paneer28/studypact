import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext.jsx'
import { useFriends } from '../hooks/useFriends.js'
import { useStudyInvites } from '../hooks/useStudyInvites.js'

const FriendsContext = createContext(null)

export function FriendsProvider({ children }) {
  const { profile } = useAuth()
  const friends = useFriends(profile)
  const invites = useStudyInvites(profile)
  return (
    <FriendsContext.Provider value={{ ...friends, ...invites }}>
      {children}
    </FriendsContext.Provider>
  )
}

export function useFriendsCtx() {
  return useContext(FriendsContext)
}
