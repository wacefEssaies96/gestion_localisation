import React, { useEffect, useState } from 'react'
import Card from '../../../components/Card'
import { Row, Col, Button, Modal, Form, Table, Dropdown, ButtonGroup, FormCheck } from 'react-bootstrap'
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

function LocationMarkers({ refresh, markers, setMarkers }) {

    const [show, setShow] = useState(false);
    const [urgence, setUrgence] = useState({});
    // const [markers, setMarkers] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = async (latlng) => {
        refreshData(latlng)
        setShow(true)
    };

    const refreshData = async (latlng) => {
        if (latlng.hasOwnProperty("lat") && latlng.hasOwnProperty("lng")) {
            const response = await axios.get(`${global.config.BACKEND_URL}/api/urgences/find-urgence/${latlng.lat}/${latlng.lng}`)
            setUrgence(response.data)
        } else {
            const response = await axios.get(`${global.config.BACKEND_URL}/api/urgences/find-urgence/${latlng.longitude}/${latlng.latitude}`)
            setUrgence(response.data)
        }

    }
    const map = useMap()
    let DefaultIcon = L.icon({
        iconUrl: icon,
        // shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(() => {
        const socket = io.connect(`${global.config.BACKEND_URL}`)
        // axios.get(url)
        //     .then((response) => {
        //         response.data.map(item => setMarkers((prevValue) => [...prevValue, [item.longitude, item.latitude]]))
        //     })
        socket.on('notification', (data) => {
            markers.push([data.urgence.longitude, data.urgence.latitude])
            setMarkers((prevValue) => [...prevValue, [data.urgence.longitude, data.urgence.latitude]]);
            L.circle([data.urgence.longitude, data.urgence.latitude], { radius: 7000, color: "red" },).addTo(map);
            refresh()
        });

        socket.on('refresh', async (data) => {
            await refresh()
            await refreshData(data.data)
        });
        // eslint-disable-next-line
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
                                <h3>Longitude</h3>
                                {urgence.hasOwnProperty('longitude') &&
                                    <h5>{urgence.longitude}</h5>
                                }
                                <h3>Latitude</h3>
                                {urgence.hasOwnProperty('latitude') &&
                                    <h5>{urgence.latitude}</h5>
                                }
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
                {markers &&
                    markers.map((marker, key) =>
                        <Marker key={key} position={marker} eventHandlers={{
                            click: (e) => {
                                handleShow(e.latlng)
                            },
                        }} ></Marker>)
                }
            </React.Fragment>
        </>

    );
}


const Google = () => {
    const depart = ['All', 'la Goulette', 'Radès', 'Sousse', 'Gabès', 'Zarzis', 'Sfax']
    const status = ['All', 'Unconscious', 'Critical condition', 'Injured', 'Difficulty breathing', 'Severe bleeding', 'Choking', 'Cardiac arrest', 'Allergic reaction', 'Overdose']
    const niveau = ['All', 1, 2, 3, 4, 5]
    const [urgences, setUrgences] = useState([]);
    const [selectedDepart, setSelectedDepart] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [enclosed, setEnclosed] = useState('All');
    const [markers, setMarkers] = useState([]);
    const refresh = () => {
        const params = new URLSearchParams();
        if (enclosed !== 'All')
            params.set('cloture', enclosed);
        if (selectedDepart && selectedDepart !== "All")
            params.set('depart', selectedDepart);

        if (selectedStatus && selectedStatus !== "All")
            params.set('status', selectedStatus);

        if (selectedNiveau && selectedNiveau !== "All")
            params.set('niveau', selectedNiveau);

        axios.get(`${global.config.BACKEND_URL}/api/urgences/find-all?${params.toString()}`)
            .then((response) => {
                setUrgences(response.data)
                setMarkers([])
                response.data.map(item => setMarkers((prevValue) => [...prevValue, [item.longitude, item.latitude]]))
            })
    }
    useEffect(() => {
        refresh();
        // eslint-disable-next-line
    }, [selectedDepart, selectedStatus, enclosed, selectedNiveau]);
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
                                <LocationMarkers refresh={refresh} markers={markers} setMarkers={setMarkers} />
                            </MapContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="12">
                    <Row>
                        <Col sm="8">
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
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Niveau</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {urgences.map((item, key) => (
                                                    <tr key={key}>
                                                        <th scope="row">{item.longitude}, {item.latitude}</th>
                                                        <td>{item.type}</td>
                                                        <td>{item.niveau}</td>
                                                        <td>{item.status}</td>
                                                    </tr>
                                                ))
                                                }


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
                        <Col sm="4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Filters</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Starting point:</label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup} style={{ float: 'right' }}>
                                                    <Button type="button" variant="warning">
                                                        {selectedDepart === null ? 'Starting point' : selectedDepart}
                                                    </Button>
                                                    <Dropdown.Toggle as={Button} split type="button" variant="warning">
                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {depart.map((item, key) => (
                                                            <Dropdown.Item key={key} href="#" onClick={() => {
                                                                setSelectedDepart(item)
                                                            }}>{item}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>

                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Status : </label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup} style={{ float: 'right' }}>
                                                    <Button type="button" variant="warning">
                                                        {selectedStatus === null ? 'Status' : selectedStatus}
                                                    </Button>
                                                    <Dropdown.Toggle as={Button} split type="button" variant="warning">
                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {status.map((item, key) => (
                                                            <Dropdown.Item key={key} href="#" onClick={() => {
                                                                setSelectedStatus(item)
                                                            }}>{item}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Niveau : </label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup} style={{ float: 'right' }}>
                                                    <Button type="button" variant="warning">
                                                        {selectedNiveau === null ? 'Niveau' : selectedNiveau}
                                                    </Button>
                                                    <Dropdown.Toggle as={Button} split type="button" variant="warning">
                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {niveau.map((item, key) => (
                                                            <Dropdown.Item key={key} href="#" onClick={() => {
                                                                setSelectedNiveau(item)
                                                            }}>{item}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Enclose</label>
                                            </div>
                                            <div style={{ float: 'right' }} className=" col-sm-8 form-check form-switch form-check-inline">
                                                {enclosed === 'All' ? <label>All</label>
                                                    : enclosed === true ? <label>Not enclosed</label> : <label>Enclosed</label>
                                                }
                                                <FormCheck.Input onChange={() => {
                                                    setEnclosed(!enclosed)
                                                }} type="checkbox" id="switch" />
                                            </div>
                                        </div>

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row >

        </div >
    )
}

// export default Google
export default React.memo(Google)

