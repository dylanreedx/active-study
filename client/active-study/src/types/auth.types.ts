export interface ProviderProps {
    children: React.ReactNode
}

export interface AuthContextProps {
    user: any,
    setUser: (user: any) => void,
    logoutUser: () => void
    loading: boolean
    setLoading: (loading: boolean) => void
}