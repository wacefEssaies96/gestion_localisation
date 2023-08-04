import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap"
import ReactApexChart from "react-apexcharts"
import axios from "axios";
import { MapContainer, Polygon, TileLayer, Tooltip, useMapEvent } from "react-leaflet";
import { gabesZerzisCoordinates, monastirGabesCoordinates, tabarkacapbonCoordinates, tunisMonastirCoordinates } from "../../utilities/coords";
import globalConfig from '../../services/config';
import '../../../node_modules/leaflet/dist/leaflet.css'

const GetPostion = ({ lngLat }) => {
    useMapEvent('click', (e) => {
        lngLat.push([e.latlng.lat, e.latlng.lng])
        console.log(lngLat);
        // setLngLat({ lng: e.latlng.lng, lat: e.latlng.lat })
    })
    return null
}
const Dashboard = () => {
    const [max,] = useState(5);
    const [region, setRegion] = useState(null);
    const [lngLat,] = useState([]);

    const [series, setSeries] = useState([{
        name: 'Number of emergencies',
        data: []
    }]);
    const [options,] = useState({
        chart: {
            type: 'line',
        },
        stroke: {
            width: [0, 4, 4],
            curve: 'straight'
        },
        title: {
            text: 'Number of monthly emergencies'
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [1, 2]
        },
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        markers: {
            size: 0,
        },
        yaxis: [
            {
                title: {
                    text: 'Number of emergencies',
                },
                max: max
            }, {
                opposite: true,
                title: {
                    text: 'Enclose'
                },
                max: max
            },
            {
                show: false,
                max: max
            },]
    },);
    const [lineChartSeries, setLineChartSeries] = useState([{
        name: 'Enclosed',
        data: []
    }, {
        name: 'Not enclosed',
        data: []
    }]);
    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        title: {
            text: 'Number of daily emergencies'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 20,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            categories: [],
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value;
                },
            }
        },
    })
    const [polarAreaSeries, setPolarAreaSeries] = useState([]);
    const [polarAreaOptions,] = useState({
        chart: {
            type: 'polarArea',
        },
        stroke: {
            colors: ['#fff']
        },
        fill: {
            opacity: 0.8
        },
        title: {
            text: 'Number of emergencies per areas'
        },
        labels: ['Tabarka - Cap bon', 'Cap bon - Monastir', 'Monastir - Gabes', 'Gabes - Zarzis'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value.toFixed(0);
                },
            }
        },
    });

    useEffect(() => {
        axios.get(globalConfig.BACKEND_URL + "/api/urgences/find-by-month").then((response) => {
            setSeries([
                {
                    name: "Number of emergencies",
                    type: 'bar',
                    data: response.data.data,
                },
                {
                    name: "Enclosed",
                    type: 'line',
                    data: response.data.enclosed,
                },
                {
                    name: "Not Enclosed",
                    type: 'line',
                    data: response.data.notEnclosed,
                },
            ]);
        })
        axios.get(globalConfig.BACKEND_URL + "/api/urgences/find-by-day").then((response) => {
            setLineChartSeries([
                {
                    name: "Enclosed",
                    data: response.data.enclosed,
                },
                {
                    name: "Not Enclosed",
                    data: response.data.notEnclosed,
                },
            ]);
            setLineChartOptions({
                xaxis: {
                    categories: response.data.days
                }
            })
        })
        axios.get(globalConfig.BACKEND_URL + "/api/urgences/find-by-region").then((response) => {
            setRegion(response.data.data)
            setPolarAreaSeries([
                response.data.data.tabarka,
                response.data.data.capBon,
                response.data.data.monastir,
                response.data.data.gabes
            ])
        })
    }, []);
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div id="chart">
                                <ReactApexChart options={options} series={series} type="bar" height={388} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <div id="chart">
                                <ReactApexChart options={polarAreaOptions} series={polarAreaSeries} type="polarArea" height={400} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div id="chart">
                                <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="bar" height={500} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <MapContainer
                                center={[36.875, 10.175]}
                                zoom={7}
                                style={{ height: '520px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Polygon positions={tabarkacapbonCoordinates} color="blue">
                                    {region && <Tooltip sticky>
                                        <h5><strong>Area : </strong>Tabarka - Cab bon</h5>
                                        Number of emergencies : {region.tabarka}
                                    </Tooltip>}
                                </Polygon>
                                <Polygon positions={tunisMonastirCoordinates} color="blue">
                                    {region && <Tooltip sticky>
                                        <h5><strong>Area : </strong>Cab bon - Monastir</h5>
                                        Number of emergencies : {region.monastir}
                                    </Tooltip>}
                                </Polygon>
                                <Polygon positions={monastirGabesCoordinates} color="blue">
                                    {region && <Tooltip sticky>
                                        <h5><strong>Area : </strong>Monastir - Gabes</h5>
                                        Number of emergencies : {region.gabes}
                                    </Tooltip>}
                                </Polygon>
                                <Polygon positions={gabesZerzisCoordinates} color="blue">
                                    {region && <Tooltip sticky>
                                        <h5><strong>Area : </strong>Gabes - Zarzis</h5>
                                        Number of emergencies : {region.zarzis}
                                    </Tooltip>}
                                </Polygon>
                                <GetPostion lngLat={lngLat}></GetPostion>
                            </MapContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default Dashboard