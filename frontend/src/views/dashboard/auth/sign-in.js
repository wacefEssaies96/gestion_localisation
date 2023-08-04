import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'
import axios from 'axios'
import Logo from '../../../components/partials/components/logo'
import { errorAlert } from '../../../services/alerts'
import globalConfig from '../../../services/config'
import '../../../services/config'
import 'lazysizes';

const SignIn = () => {
   const [inputValue, setInputValue] = useState({
      email: "",
      password: "",
   });
   const navigate = useNavigate()
   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await axios.post(
            globalConfig.BACKEND_URL + "/api/auth/login",
            {
               email: e.target.email.value,
               password: e.target.password.value
            },
            { withCredentials: true }
         );
         if (data.message === 'User logged in successfully')
            navigate('/')
         else
            errorAlert(data.message)

      } catch (error) {
         console.log(error);
      }
      setInputValue({
         email: "",
         password: "",
      });
   };
   return (
      <>
         <section className="login-content">
            <Row className="m-0 align-items-center bg-white vh-100">
               <Col md="6">
                  <Row className="justify-content-center">
                     <Col md="10">
                        <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                           <Card.Body>
                              <Link to="/" className="navbar-brand d-flex align-items-center mb-3">
                                 <Logo></Logo>
                                 <h4 className="logo-title ms-3">SeaSOS</h4>
                              </Link>
                              <h2 className="mb-2 text-center">Sign In</h2>
                              <p className="text-center">Login to stay connected.</p>
                              <Form onSubmit={handleSubmit}>
                                 <Row>
                                    <Col lg="12">
                                       <Form.Group className="form-group">
                                          <Form.Label htmlFor="email" className="">Email</Form.Label>
                                          <Form.Control type="email" className="" id="email" aria-describedby="email" name="email"
                                             defaultValue={inputValue.email}
                                             placeholder="Enter your email"
                                          />
                                       </Form.Group >
                                    </Col>
                                    <Col lg="12" className="">
                                       <Form.Group className="form-group">
                                          <Form.Label htmlFor="password" className="">Password</Form.Label>
                                          <Form.Control type="password" className="" id="password" aria-describedby="password" name="password"
                                             defaultValue={inputValue.password}
                                             placeholder="Enter your password"
                                          />
                                       </Form.Group>
                                    </Col>
                                    <Col lg="12" className="d-flex justify-content-between">
                                       {/* <Form.Check className="form-check mb-3">
                                          <Form.Check.Input type="checkbox" id="customCheck1" />
                                          <Form.Check.Label htmlFor="customCheck1">Remember Me</Form.Check.Label>
                                       </Form.Check> */}
                                       <Link className="mb-3" to="/auth/reset-password">Forgot Password?</Link>
                                    </Col>
                                 </Row>
                                 <div className="d-flex justify-content-center">
                                    <Button type="submit" variant="btn btn-primary">Sign In</Button>
                                 </div>
                              </Form>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Row>
                  <div className="sign-bg">
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
               <Col md="6" className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
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
                  {/* <Image src={auth1} className="lazyload Image-fluid gradient-main animated-scaleX" alt="images" /> */}
               </Col>
            </Row>
         </section>
      </>
   )
}

export default SignIn
