import React from 'react'
import {Container,Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import error404 from '../../../assets/images/error/404.png'
import 'lazysizes'
 const Error404 = () => {
    return (
        <>
            <div className="gradient">
                <Container>
                    <Image src={error404} className="lazyload img-fluid mb-4 w-50" alt=""/> 
                    <h2 className="mb-0 mt-4 text-white">Oops! Page Not Found.</h2>
                    <p className="mt-2 text-white">The requested page doesn't exist.</p>
                    <Link className="btn bg-white text-primary d-inline-flex align-items-center" to="/">Back to Home</Link>
                </Container>
                <div className="box">
                    <div className="c xl-circle">
                        <div className="c lg-circle">
                            <div className="c md-circle">
                                <div className="c sm-circle">
                                    <div className="c xs-circle">                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </>
    )
}

export default Error404;
