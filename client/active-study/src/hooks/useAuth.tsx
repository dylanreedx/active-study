/* eslint-disable import/no-anonymous-default-export */
import { createContext, useContext, useEffect, useState } from 'react'
import { getUserData } from '../services/user.services'
import { redirect } from 'react-router'
import { useCookies } from 'react-cookie'
import { logout } from '../services/auth.services'
import { AuthContextProps, ProviderProps } from '../types'

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

const useAuth = () => {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const [, , removeCookie] = useCookies(['laravel-session'])

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    setLoading(true)
                    const response = await getUserData()
                    if (response.status === 200) {
                        setUser(response.data)
                        redirect('login')
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }

            })()
        }
    }, [token])


    const logoutUser = () => {
        logout()
        localStorage.removeItem('token')
        removeCookie('laravel-session')
    }

    return {
        user, setUser, logoutUser, loading, setLoading
    }
}

export function AuthProvider({ children }: ProviderProps) {
    const auth = useAuth()
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export default () => useContext(AuthContext)