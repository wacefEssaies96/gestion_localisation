import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap"
import ReactApexChart from "react-apexcharts"
import axios from "axios";

const Dashboard = () => {
    useEffect(() => {
        axios.get(`http://localhost:3030/api/urgences/find-by-month`)
            .then((response) => {
                setSeries([
                    {
                        name: "Number of emergencies",
                        data: response.data.message,
                    },
                ]);
            })
        axios.get(`http://localhost:3030/api/urgences/find-by-day`)
            .then((response) => {
                setLineChartSeries([
                    {
                        name: "Number of emergencies",
                        data: response.data.data,
                    },
                ]);
                setLineChartOptions({
                    xaxis: {
                        categories: response.data.days
                    }
                })
            })
    }, []);

    const [series, setSeries] = useState([{
        name: 'Number of emergencies',
        data: []
    }]);
    const [options,] = useState({
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },

        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val;
                }
            }

        },
        title: {
            text: 'Number of monthly emergencies.',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    });

    const [lineChartSeries, setLineChartSeries] = useState([{
        name: 'Number of emergencies',
        data: []
    }]);
    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Number of daily emergencies',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: [],
        }
    },

    )
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Chart</h2>
                        </Card.Header>
                        <Card.Body>
                            <div id="chart">
                                <ReactApexChart options={options} series={series} type="bar" height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Chart</h2>
                        </Card.Header>
                        <Card.Body>
                            <div id="chart">
                                <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default Dashboard