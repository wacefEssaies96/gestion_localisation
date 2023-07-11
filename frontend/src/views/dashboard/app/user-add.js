import React, { useEffect, useState } from 'react'
import { Image, Form, Button, Modal, FormControl } from 'react-bootstrap'
import avatars6 from '../../../assets/images/avatars/avtar_5.webp'
import { submitUser } from '../../../services/user'

const UserForm = ({ refresh, handleClose, handleShow, show, mode, userToEdit }) => {

   const [formData, setFormData] = useState({
      _id: userToEdit._id,
      fullname: userToEdit.fullname,
      email: userToEdit.email,
      password: userToEdit.password,
      gender: userToEdit.gender,
      address: userToEdit.address,
      phone: userToEdit.phone
   });

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      await submitUser(formData  , mode)
      handleClose()
      refresh()
   }
   useEffect(() => {
      setFormData(userToEdit)
   }, [userToEdit]);

   return (
      <>
         <div>
            <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} size="lg">
               <form encType='multipart/form-data' onSubmit={handleSubmit}>
                  <Modal.Header closeButton>
                     {mode === "create"
                        ? <Modal.Title>Add new user</Modal.Title>
                        : <Modal.Title>Edit user</Modal.Title>
                     }
                  </Modal.Header>
                  <Modal.Body>
                     <div className="new-user-info">
                        <div className="row">
                           <div className="profile-img-edit position-relative col-md-2 mb-4">
                              {/* <Image className="theme-color-default-img  profile-pic rounded avatar-100" src={avatars1} alt="profile-pic" />
                              <Image className="theme-color-purple-img profile-pic rounded avatar-100" src={avatars2} alt="profile-pic" />
                              <Image className="theme-color-blue-img profile-pic rounded avatar-100" src={avatars3} alt="profile-pic" />
                              <Image className="theme-color-green-img profile-pic rounded avatar-100" src={avatars5} alt="profile-pic" /> */}
                              <Image className="lazyload theme-color-yellow-img profile-pic rounded avatar-100" src={avatars6} alt="profile-pic" />
                              {/* <Image className="theme-color-pink-img profile-pic rounded avatar-100" src={avatars4} alt="profile-pic" /> */}
                           </div>
                           <FormControl type='hidden' name='id' value={formData._id} onChange={handleChange} />
                           <Form.Group className="col-md-10 form-group">
                              <Form.Label htmlFor="fname">Full Name:</Form.Label>
                              <Form.Control value={formData.fullname} onChange={handleChange} type="text" id="fullname" name="fullname" placeholder="Full Name" required />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="add1">Address :</Form.Label>
                              <Form.Control value={formData.address} onChange={handleChange} type="text" name="address" id="address" placeholder="Address" required />
                           </Form.Group>
                           <Form.Group className="col-md-6  form-group">
                              <Form.Label htmlFor="mobno">Mobile Number:</Form.Label>
                              <Form.Control value={formData.phone} onChange={handleChange} type="number" name="phone" id="phone" placeholder="Mobile Number" required />
                           </Form.Group>
                           <Form.Group className="col-sm-12 form-group">
                              <Form.Label>Gender:</Form.Label>
                              <select name="gender" value={formData.gender} onChange={handleChange} id="gender" className="selectpicker form-control" data-style="py-0" required>
                                 <option value="">Select gender</option>
                                 <option value="MALE">Male</option>
                                 <option value="FEMALE">Female</option>
                              </select>
                           </Form.Group>
                        </div>
                        {mode === 'create'
                           ? <>
                              <hr />
                              <h5 className="mb-3">Security</h5>
                              <div className="row">
                                 <Form.Group className="col-md-12 form-group">
                                    <Form.Label htmlFor="email">Email:</Form.Label>
                                    <Form.Control value={formData.email} onChange={handleChange} type="email" name="email" id="email" placeholder="Email" required />
                                 </Form.Group>
                                 <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="pass">Password:</Form.Label>
                                    <Form.Control type="password" value={formData.password} onChange={handleChange} name="password" id="password" placeholder="Password" required />
                                 </Form.Group>
                                 <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="rpass">Repeat Password:</Form.Label>
                                    <Form.Control type="password" id="rpass" placeholder="Repeat Password" required />
                                 </Form.Group>
                              </div>
                           </>
                           : <></>
                        }
                     </div>
                  </Modal.Body>
                  <Modal.Footer>
                     {mode === 'create'
                        ? <Button type="submit" variant="btn btn-primary">Add New User</Button>
                        : <Button type="submit" variant="btn btn-primary">Edit User</Button>
                     }
                     <Button type="button" onClick={handleClose} variant="btn btn-secondary">Close</Button>
                  </Modal.Footer>
               </form>
            </Modal>
         </div>
      </>
   )

}

export default UserForm;