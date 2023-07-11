import React, { useEffect, useState } from 'react'
import Card from '../../../components/Card'
import { Row, Col, Button, Modal, Form, Table } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import '../../../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet';
import icon from '../../../assets/images/vectormap/marker1.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios'
import './map-style.css'
import '../../../services/config';
import 'lazysizes';

const socket = io.connect(`${global.config.BACKEND_URL}`)

function LocationMarkers({ refresh }) {

    const [show, setShow] = useState(false);
    const [urgence, setUrgence] = useState({});
    const [markers, setMarkers] = useState([]);

    const refreshData = async (latlng) => {
        if (latlng.hasOwnProperty("lat") && latlng.hasOwnProperty("lng")) {
            const response = await axios.get(`${global.config.BACKEND_URL}/api/urgences/find-urgence/${latlng.lat}/${latlng.lng}`)
            setUrgence(response.data)
            console.log(response);
        } else {
            const response = await axios.get(`${global.config.BACKEND_URL}/api/urgences/find-urgence/${latlng.longetude}/${latlng.latitude}`)
            setUrgence(response.data)
        }

    }
    const handleClose = () => setShow(false);
    const handleShow = async (latlng) => {
        refreshData(latlng)
        setShow(true)
    };
    const map = useMap()
    let DefaultIcon = L.icon({
        iconUrl: icon,
        // shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    socket.on('notification', async (data) => {
        markers.push([data.urgence.longetude, data.urgence.latitude])
        setMarkers((prevValue) => [...prevValue, [data.urgence.longetude, data.urgence.latitude]]);
        L.circle([data.urgence.longetude, data.urgence.latitude], { radius: 7000, color: "red" },).addTo(map);
        refresh()
    });

    socket.on('refresh', async (data) => {
        await refresh()
        await refreshData(data.data)
    });

    useEffect(() => {
        axios.get(`${global.config.BACKEND_URL}/api/urgences/find-all`)
            .then((response) => {
                response.data.map(item => setMarkers((prevValue) => [...prevValue, [item.longetude, item.latitude]]))
            })
    }, [])

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Urgence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                        <div>
                            <div style={{ backgroundColor: "lightgrey", width: "fit-content", padding: '10px' }}>
                                <h3>Longetude</h3>
                                <h5>{urgence.longetude}</h5>
                                <h3>Latitude</h3>
                                <h5>{urgence.latitude}</h5>
                            </div>
                            <div>

                            </div>
                            {urgence.hasOwnProperty('nomprenom') &&
                                <h5>Nom et prenom</h5>
                            }
                            <p>{urgence.nomprenom}</p>
                            {urgence.hasOwnProperty('tel') &&
                                <h5>Numéro de téléphone</h5>
                            }
                            <p>{urgence.tel}</p>
                            {urgence.hasOwnProperty('nomprenom') &&
                                <h5>Nom et prenom</h5>
                            }
                            <p>{urgence.nomprenom}</p>
                            {urgence.hasOwnProperty('age') &&
                                <h5>Age</h5>
                            }
                            <p>{urgence.age}</p>
                            {urgence.hasOwnProperty('depart') &&
                                <h5>Point de départ</h5>
                            }
                            <p>{urgence.depart}</p>
                            {urgence.hasOwnProperty('niveau') &&
                                <h5>Niveau d'urgence</h5>
                            }
                            <p>{urgence.niveau}</p>
                        </div>
                        <div>
                            {urgence.hasOwnProperty('type') &&
                                <h5>Type d'urgence</h5>
                            }
                            <p>{urgence.type}</p>
                            {urgence.hasOwnProperty('taille') &&
                                <h5>Taille du bateau</h5>
                            }
                            <p>{urgence.taille}</p>
                            {urgence.hasOwnProperty('nbrpersonne') &&
                                <h5>Nombre de personne</h5>
                            }
                            <p>{urgence.nbrpersonne}</p>
                            {urgence.hasOwnProperty('status') &&
                                <h5>Status</h5>
                            }
                            <p>{urgence.status}</p>
                            {urgence.hasOwnProperty('distance') &&
                                <h5>Distance de déplacement</h5>
                            }
                            <p>{urgence.distance}</p>
                            {urgence.hasOwnProperty('communication') &&
                                <h5>Communication</h5>
                            }
                            <p>{urgence.communication}</p>
                            {urgence.hasOwnProperty('police') &&
                                <h5>Police</h5>
                            }
                            <p>{urgence.police}</p>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer variant="secondary">
                    <Form.Group>
                        <Form.Control type="email" placeholder='Email' />
                    </Form.Group>
                    <Button variant="primary" onClick={() => { handleClose() }}>
                        Envoyer
                    </Button>{' '}
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <React.Fragment>
                {markers.map((marker, key) =>
                    <Marker key={key} position={marker} eventHandlers={{
                        click: (e) => {
                            handleShow(e.latlng)
                        },
                    }} ></Marker>)}
            </React.Fragment>
        </>

    );
}


const Google = () => {
    const [urgences, setUrgences] = useState([]);
    const refresh = () => {
        axios.get(`${global.config.BACKEND_URL}/api/urgences/find-all`)
            .then((response) => {
                setUrgences(response.data)
            })
    }
    useEffect(() => {
        refresh()
    }, []);
    return (
        <div>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Map</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <MapContainer
                                center={[36.96021, 10.319944]}
                                zoom={5}
                                style={{ width: '100%', height: '520px' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarkers refresh={refresh} />
                            </MapContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">SOS</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="bd-example table-responsive">
                                <Table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Lng & lat</th>
                                            <th scope="col">Fullname</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Niveau</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {urgences.map((item, key) => (
                                            <tr key="key">
                                                <th scope="row">{item.longetude}, {item.latitude}</th>
                                                <th>{item.nomprenom}</th>
                                                <td>{item.type}</td>
                                                <td>{item.niveau}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        ))}

                                        {/* <tr className="table-danger">
                                            <th scope="row">Danger</th>
                                            <td>Cell</td>
                                            <td>Cell</td>
                                        </tr>
                                        <tr className="table-warning">
                                            <th scope="row">Warning</th>
                                            <td>Cell</td>
                                            <td>Cell</td>
                                        </tr> */}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

// export default Google
export default React.memo(Google)

