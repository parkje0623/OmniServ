import React from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';

function Layout({ children }) {
    const location = useLocation();
    // Do not include header for these pages
    const noLayoutPaths = ['/signin', '/signup'];

    return (
        <div className='App'>
            <SideBar />
            <div className='App-body'>
                <div className='app-heading'>
                    {!noLayoutPaths.includes(location.pathname) && 
                        <Header path={location.pathname} />
                    }
                </div>
    
                <div className='app-main'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
