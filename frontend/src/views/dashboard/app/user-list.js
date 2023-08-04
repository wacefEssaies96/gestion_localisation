import React, { useEffect, useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Card from '../../../components/Card'
import { confirmDelete } from '../../../services/alerts'
import '../../../services/config'
import { fetchData } from '../../../services/mix'
import globalConfig from '../../../services/config'
const UserForm = React.lazy(() => import('./user-add'))

const UserList = () => {
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const [userToEdit, setUserToEdit] = useState({
      _id: '',
      fullname: '',
      email: '',
      password: '',
      gender: '',
      address: '',
      phone: 0
   });
   const [userlist, setUserlist] = useState([]);
   const [mode, setMode] = useState('create');
   const refresh = () => {
      fetchData(`${globalConfig.BACKEND_URL}/api/users/find-all`)
         .then(response => setUserlist(response))
   }
   useEffect(() => {
      refresh()
   }, []);
   return (
      <>
         <div>
            <Row>
               <Col sm="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                           <h4 className="card-title">User List</h4>
                        </div>
                        <div>
                           <Button className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3" onClick={() => {
                              setMode('create')
                              setUserToEdit({
                                 _id: '',
                                 fullname: '',
                                 email: '',
                                 password: '',
                                 gender: '',
                                 address: '',
                                 phone: 0
                              })
                              handleShow()
                           }}>
                              <i className="btn-inner">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                 </svg>
                              </i>
                              <span>New user</span>
                           </Button>
                           <UserForm refresh={refresh} show={show} handleClose={handleClose} handleShow={handleShow} userToEdit={userToEdit} mode={mode}> </UserForm>
                        </div>
                     </Card.Header>
                     <Card.Body className="px-0">
                        <div className="table-responsive">
                           <table id="user-list-table" className="table table-striped" role="grid" data-toggle="data-table">
                              <thead>
                                 <tr className="ligth">
                                    {/* <th>Id</th> */}
                                    <th>Fullname</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Gender</th>
                                    <th>Address</th>
                                    <th min-width="100px">Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    userlist.map((item, idx) => (
                                       <tr key={idx}>
                                          <td>{item.fullname}</td>
                                          <td>{item.phone}</td>
                                          <td>{item.email}</td>
                                          <td>{item.role}</td>
                                          <td>{item.gender}</td>
                                          <td>{item.address}</td>
                                          <td>
                                             <div className="flex align-items-center list-user-action">
                                                <Link onClick={() => {
                                                   setMode('edit')
                                                   setUserToEdit(item)
                                                   handleShow()
                                                   console.log(userToEdit);
                                                }}
                                                   className="btn btn-sm btn-icon btn-warning" data-toggle="tooltip" data-placement="top" title="Edit" data-original-title="Edit" to="#">
                                                   <span className="btn-inner">
                                                      <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                         <path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                      </svg>
                                                   </span>
                                                </Link>{' '}
                                                <Link onClick={async () => {
                                                   confirmDelete(`${globalConfig.BACKEND_URL}/api/users/delete/${item._id}`, refresh)
                                                }} className="btn btn-sm btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Delete" data-original-title="Delete" to="#">
                                                   <span className="btn-inner">
                                                      <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                         <path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                      </svg>
                                                   </span>
                                                </Link>{' '}
                                             </div>
                                          </td>
                                       </tr>))}
                              </tbody>
                           </table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </>
   )

}

export default UserList;