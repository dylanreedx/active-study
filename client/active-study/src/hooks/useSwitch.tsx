/* eslint-disable import/no-anonymous-default-export */
import React, { createContext, useContext, useState } from 'react'


interface ProviderProps {
    children: React.ReactNode
}

interface SwitchContextProps {
    switchToSignUp: () => void
    switchToSignIn: () => void
    backDropVariants: {
        expanded: {
            width: string
            height: string
            borderRadius: string
            transform: string
        }
        collapsed: {
            width: string
            height: string
            borderRadius: string
            transform: string
        }
    }
    expandingTransition: {
        type: string
        duration: number
        stiffness: number
    }
    isExpanded: boolean
    active: string
    playExpandingAnimation: () => void
}



const SwitchContext = createContext<SwitchContextProps>({} as SwitchContextProps)

const useSwitch = () => {
    const backDropVariants = {
        expanded: {
            width: "250%",
            height: "150vh",
            borderRadius: "20%",
            transform: "rotate(-5deg)"
        },
        collapsed: {
            left: "-50%",
            width: "300%",
            height: "550px",
            borderRadius: "50%",
            transform: "rotate(-5deg)"
        }
    }

    const expandingTransition = {
        type: "spring",
        duration: 2.3,
        stiffness: 30
    }

    const [isExpanded, setIsExpanded] = useState(false)
    const [active, setActive] = useState("signin")

    const playExpandingAnimation = () => {
        setIsExpanded(true)
        setTimeout(() => {
            setIsExpanded(false)
        }, expandingTransition.duration * 1000 * 0.325)
    }

    const switchToSignUp = () => {
        playExpandingAnimation()
        setTimeout(() => {
            setActive("signup")
        }, 400)
    }

    const switchToSignIn = () => {
        playExpandingAnimation()
        setTimeout(() => {
            setActive("signin")
        }, 400)
    }


    return {
        switchToSignUp, switchToSignIn, backDropVariants,
        expandingTransition, isExpanded, active,
        playExpandingAnimation
    }

}

export function SwitchProvider({ children }: ProviderProps) {
    const userSwitch = useSwitch()

    return (
        <SwitchContext.Provider value={userSwitch}>
            {children}
        </SwitchContext.Provider>
    )
}

export default () => useContext(SwitchContext)