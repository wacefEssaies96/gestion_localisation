import React from 'react'
import logo from '../../../assets/images/logo.webp'
import 'lazysizes';
const Logo = (props) => {

    return (
        <>
            <img className='lazyload' alt='logo seasos' width={50} height={50} src={logo}></img>
        </>
    )
}

export default Logo
