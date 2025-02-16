import { Outlet } from 'react-router'
import { NavBar } from '../../components'
import { StyledContainer } from './styles'

export const RootLayout = () => {

    return (<>
        {/* {(loadingNews || loadingSettings) ? (<Spinner />) : ( */}
            <StyledContainer>
                <NavBar />
                <div className="content">
                    <Outlet />
                </div>
            </StyledContainer>
        {/* )} */}
        </>
    )
}