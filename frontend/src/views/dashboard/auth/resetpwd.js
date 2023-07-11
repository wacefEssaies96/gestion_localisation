import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'
import '../../../services/config'
import 'lazysizes'
import useQueryParams from '../../../services/useQueryParams'
import Logo from '../../../components/partials/components/logo'
import { changepwd } from '../../../services/user'
import { errorAlert } from '../../../services/alerts'


const Resetpwd = () => {
    const { token } = useQueryParams()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await changepwd(e, token)
        if (response.message === "Password updated successfully !")
            navigate('/auth/sign-in')
        else
            errorAlert(response.message)
    }

    return (
        <>
            <section className="login-content">
                <Row className="m-0 align-items-center bg-white vh-100">
                    <Col md="6" className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
                        {/* <Image src={auth2} className="lazyload img-fluid gradient-main animated-scaleX" alt="images" /> */}
                        <div className="gradient-top">
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
                    </Col>
                    <Col md="6" className="p-0">
                        <Card className="card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
                            <Card.Body>
                                <Link to="/" className="navbar-brand d-flex align-items-center mb-3">
                                    <Logo></Logo>
                                    <h4 className="logo-title ms-3">SeaSOS</h4>
                                </Link>
                                <h2 className="mb-2">Reset Password</h2>
                                <p>Enter your new password.</p>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col lg="12" className="col-lg-12">
                                            <Form.Group className="floating-label">
                                                <Form.Label htmlFor="email" className="form-label">New password</Form.Label>
                                                <Form.Control required type="password" className="form-control" id="password" name="password" aria-describedby="password" placeholder=" " />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button className="mt-3" type="submit" variant="primary">Confirm</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="sign-bg sign-bg-right">
                            {/* <svg width="280" height="230" viewBox="0 0 431 398" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.05">
                                    <rect x="-157.085" y="193.773" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 -157.085 193.773)" fill="#3B8AFF" />
                                    <rect x="7.46875" y="358.327" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 7.46875 358.327)" fill="#3B8AFF" />
                                    <rect x="61.9355" y="138.545" width="310.286" height="77.5714" rx="38.7857" transform="rotate(45 61.9355 138.545)" fill="#3B8AFF" />
                                    <rect x="62.3154" y="-190.173" width="543" height="77.5714" rx="38.7857" transform="rotate(45 62.3154 -190.173)" fill="#3B8AFF" />
                                </g>
                            </svg> */}
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Resetpwd
