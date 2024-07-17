import React, { Component } from 'react';
import '../../../assets/css/SingleBuilding.css';
import Chart from 'react-apexcharts';
import timeIcon from "../../../assets/icons/svg/timeIcon.svg";
import AvgInsideTemp from "../../../assets/icons/svg/AverageInside.svg";
import currentOut from "../../../assets/icons/svg/CurrentOutside.svg";
import valueOpen from "../../../assets/icons/svg/ValvesOpened.svg";
import valueClose from "../../../assets/icons/svg/ValvesClosed.svg";
import fullScreen from "../../../assets/icons/svg/fullScreen.svg";
import sideScreen from "../../../assets/icons/svg/sideScreen.svg";
import down_arrow from "../../../assets/icons/svg/DownArrow.svg";
import addDataPoints from "../../../assets/icons/svg/AddDataPoints.svg";
import onImg from "../../../assets/icons/svg/on.svg"
import offImg from "../../../assets/icons/svg/off.svg"
import backIcon from "../../../assets/icons/svg/backIcons.svg"
import boiler_video from "../../../assets/icons/svg/AddDataPoints.svg"
import urlMapping, { envURL, config, client } from '../../Api/Api';
import { Offline, Online, Detector } from "react-detect-offline";
import localisation from "../../../assets/localisation/localisation";
import ApiCall from '../../Api/ApiCall';
// popup
import DHW from '../../../assets/icons/svg/DHW.svg'
import coil from '../../../assets/icons/svg/Coil.svg'
import stack from '../../../assets/icons/svg/Stack.svg'
import pressure from '../../../assets/icons/svg/Pressure.svg'
import returnImg from '../../../assets/icons/svg/Return.svg'
import Bleak from '../../../assets/icons/svg/BoilerLeak.svg'
import BPumps from '../../../assets/icons/svg/Pumps.svg'
import Supply from '../../../assets/icons/svg/Supply.svg'
import co2 from '../../../assets/icons/svg/CO2.svg'
import pmSensor from '../../../assets/icons/svg/pMSensor.svg'
import nox from '../../../assets/icons/svg/NOx.svg'
import voc from '../../../assets/icons/svg/VOC.svg'

// newImagepopup
import DHW_new from '../../../assets/icons/svg/DHWSelect.svg'
import coil_new from '../../../assets/icons/svg/CoilSelect.svg'
import stack_new from '../../../assets/icons/svg/StackSelect.svg'
import pressure_new from '../../../assets/icons/svg/PressureSelect.svg'
import returnImg_new from '../../../assets/icons/svg/ReturnSelect.svg'
import Bleak_new from '../../../assets/icons/svg/BoilerLeakSelect.svg'
import BPumps_new from '../../../assets/icons/svg/PumpsSelect.svg'
import Supply_new from '../../../assets/icons/svg/SupplySelect.svg'
import co2_new from '../../../assets/icons/svg/CO2Select.svg'
import pmSensor_new from '../../../assets/icons/svg/pMSensorSelect.svg'
import nox_new from '../../../assets/icons/svg/NOxSelect.svg'
import voc_new from '../../../assets/icons/svg/VOCSelect.svg'

import cancelIcon from '../../../assets/icons/svg/cancel_btn.svg'
// import Divider_boilerData from '../../../assets/icons/svg/Boiler_Data.svg'
// import Divider_buildingData from '../../../assets/icons/svg/Building_Data.svg'
// import Divider_airQData from '../../../assets/icons/svg/Air_Quality_Data.svg'

import Divider from '../../../assets/icons/svg/divider.svg'

import moment from 'moment-timezone';


class ImageToggle extends Component {
    render() {
        const { originalSrc, newSrc, alt, label, toggleState, handleToggle } = this.props;

        return (
            <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2" onClick={handleToggle}>
                <img src={toggleState ? newSrc : originalSrc} alt={alt} />
                <p>{label}</p>
            </div>
        );
    }
}
const radioStyle = {
    appearance: 'none',
    width: '14px',
    height: '12px',
    backgroundColor: '#D3DFF2',
    borderRadius: '50%',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border 0.1s, background 0.1s',
    marginRight: '2px',
    
};

const checkedStyle = {
    borderColor: '#78F0CD',
    backgroundColor: '#78F0CD',
};

class SingleBuilding extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hoveredValue: null,
            hoveredDate: null,
            hoveredValueIn: null,
            hoveredDateIn: null,
            hoveredValueDHW: null,
            hoveredDateDHW: null,
            hoveredValueCoil: null,
            hoveredDateCoil: null,
            hoveredValueStack: null,
            hoveredDateStack: null,
            hoveredValuePre: null,
            hoveredDatePre: null,
            hoveredValueRe: null,
            hoveredDateRe: null,
            hoveredValueSu: null,
            hoveredDateSu: null,
            hoveredValueB: null,
            hoveredDateB: null,
            hoveredValueV: null,
            hoveredDateV: null,
            hoveredValueN: null,
            hoveredDateN: null,
            hoveredValueC: null,
            hoveredDateC: null,
            onlineSmu: 0,
            offlineSmu: 0,
            onlineBmu: 0,
            offlineBmu: 0,
            avgTemp: 0,
            outsideTemperature: 0,
            outsideHumidity: '',
            lastUpdate: null,
            bmuList: [],
            selectedIndex: 0,
            image: '',        
            categories: [],
            series: [
                {
                    name: "series-1",
                    data: [],
                },
            ],
            options: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValue = this.state.series[0].data[dataPointIndex];
                                const hoveredDate = this.state.categories[dataPointIndex];
                                if (this.state.hoveredValue !== hoveredValue || this.state.hoveredDate !== hoveredDate) {
                                    this.setState({ hoveredValue, hoveredDate });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValue: null, hoveredDate: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                xaxis: {
                    type: 'time',
                    categories: [],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#00f3af']
            },
            categoriesIn: [
               
            ],
            seriesIn: [
                {
                    name: "series-1",
                    data: [],
                },
            ],
            optionsIn: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: false // Disable animations
                    },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueIn = this.state.seriesIn[0].data[dataPointIndex];
                                const hoveredDateIn = this.state.categoriesIn[dataPointIndex];
                                if (this.state.hoveredValueIn !== hoveredValueIn || this.state.hoveredDateIn !== hoveredDateIn) {
                                    this.setState({ hoveredValueIn, hoveredDateIn });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueIn: null, hoveredDateIn: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        
                    ],
                    
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#F90000'],
            },
            categoriesDHW: [
                
            ],
            seriesDHW: [
                {
                    name: "series-DHW",
                    data: [],
                },
            ],
            optionsDHW: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 1000 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueDHW = this.state.seriesDHW[0].data[dataPointIndex];
                                const hoveredDateDHW = this.state.categoriesDHW[dataPointIndex];
                                if (this.state.hoveredValueDHW !== hoveredValueDHW || this.state.hoveredDateDHW !== hoveredDateDHW) {
                                    this.setState({ hoveredValueDHW, hoveredDateDHW });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueDHW: null, hoveredDateDHW: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#351C89'],
                
                
            },
            optionsCoil: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueCoil = this.state.seriesCoil[0].data[dataPointIndex];
                                const hoveredDateCoil = this.state.categoriesCoil[dataPointIndex];
                                if (this.state.hoveredValueCoil !== hoveredValueCoil || this.state.hoveredDateCoil !== hoveredDateCoil) {
                                    this.setState({ hoveredValueCoil, hoveredDateCoil });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueCoil: null, hoveredDateCoil: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#2BF7F4'],

            },
            categoriesCoil: [
                
            ],
            seriesCoil: [
                {
                    name: "series-Coil",
                    data: [],
                },
            ],
            optionsStack: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueStack = this.state.seriesStack[0].data[dataPointIndex];
                                const hoveredDateStack = this.state.categoriesStack[dataPointIndex];
                                if (this.state.hoveredValueStack !== hoveredValueStack || this.state.hoveredDateStack !== hoveredDateStack) {
                                    this.setState({ hoveredValueStack, hoveredDateStack });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueStack: null, hoveredDateStack: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#40E0D0'],

            },
            categoriesStack: [
                
            ],
            seriesStack: [
                {
                    name: "series-stack",
                    data: [],
                },
            ],
            optionsPre: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValuePre = this.state.seriesPre[0].data[dataPointIndex];
                                const hoveredDatePre = this.state.categoriesPre[dataPointIndex];
                                if (this.state.hoveredValuePre !== hoveredValuePre || this.state.hoveredDatePre !== hoveredDatePre) {
                                    this.setState({ hoveredValuePre, hoveredDatePre });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValuePre: null, hoveredDatePre: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#c7c422'],

            },
            categoriesPre: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesPre: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsSu: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueSu = this.state.seriesSu[0].data[dataPointIndex];
                                const hoveredDateSu = this.state.categoriesSu[dataPointIndex];
                                if (this.state.hoveredValueSu !== hoveredValueSu || this.state.hoveredDateSu !== hoveredDateSu) {
                                    this.setState({ hoveredValueSu, hoveredDateSu });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueSu: null, hoveredDateSu: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#752110'],

            },
            categoriesSu: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesSu: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsRe: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueRe = this.state.seriesRe[0].data[dataPointIndex];
                                const hoveredDateRe = this.state.categoriesRe[dataPointIndex];
                                if (this.state.hoveredValueRe !== hoveredValueRe || this.state.hoveredDateRe !== hoveredDateRe) {
                                    this.setState({ hoveredValueRe, hoveredDateRe });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueRe: null, hoveredDateRe: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#B92BF7'],

            },
            categoriesRe: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesRe: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsB: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueB = this.state.seriesB[0].data[dataPointIndex];
                                const hoveredDateB = this.state.categoriesB[dataPointIndex];
                                if (this.state.hoveredValueB !== hoveredValueB || this.state.hoveredDateB !== hoveredDateB) {
                                    this.setState({ hoveredValueB, hoveredDateB });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueB: null, hoveredDateB: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#107517'],

            },
            categoriesB: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesB: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsV: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueV = this.state.seriesV[0].data[dataPointIndex];
                                const hoveredDateV = this.state.categoriesV[dataPointIndex];
                                if (this.state.hoveredValueV !== hoveredValueV || this.state.hoveredDateV !== hoveredDateV) {
                                    this.setState({ hoveredValueV, hoveredDateV });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueV: null, hoveredDateV: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#581075'],

            },
            categoriesV: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesV: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsN: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueN = this.state.seriesN[0].data[dataPointIndex];
                                const hoveredDateN = this.state.categoriesN[dataPointIndex];
                                if (this.state.hoveredValueN !== hoveredValueN || this.state.hoveredDateN !== hoveredDateN) {
                                    this.setState({ hoveredValueN, hoveredDateN });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueN: null, hoveredDateN: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#107545'],

            },
            categoriesN: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesN: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            optionsC: {
                chart: {
                    type: 'area',
                    // height: 220,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // Hides the toolbar
                    },
                    animations: {
                        enabled: true, // Enable animations
                        easing: 'linear', // Use linear easing for smooth transitions
                        speed: 100 // Set the animation speed to 200 milliseconds
                      },
                    events: {
                        mouseMove: (event, chartContext, config) => {
                            if (config.dataPointIndex !== undefined) {
                                const dataPointIndex = config.dataPointIndex;
                                const hoveredValueC = this.state.seriesC[0].data[dataPointIndex];
                                const hoveredDateC = this.state.categoriesC[dataPointIndex];
                                if (this.state.hoveredValueC !== hoveredValueC || this.state.hoveredDateC !== hoveredDateC) {
                                    this.setState({ hoveredValueC, hoveredDateC });
                                }
                            }
                        },
                        mouseLeave: () => {
                            this.setState({ hoveredValueC: null, hoveredDateC: null });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: { width: 1, curve: 'smooth' },
                fill: {
                    type: "gradient",
                    // colors: ["#EACB8F"],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2021-09-19T00:00:00',
                        '2021-09-19T01:30:00',
                        '2021-09-19T02:30:00',
                        '2021-09-19T03:30:00',
                        '2021-09-19T04:30:00',
                        '2021-09-19T05:30:00',
                        '2021-09-19T06:30:00'
                    ],
                    // crosshairs: {
                    //     show: true,
                    //     width: 1,
                    //     position: 'back',
                    //     opacity: 0.1,
                    //     stroke: {
                    //         color: '#b6b6b6',
                    //         width: 0.5,
                    //         dashArray: 3
                    //     }
                    // },
                    labels: {
                        show: false // Hide x-axis labels
                    }
                },
                yaxis: {
                    show: false // Hide y-axis
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false,
                    custom: function () {
                        return '<div></div>'; // Return an empty div to hide the tooltip content
                    }
                },
                markers: {
                    hover: {
                        size: 5 // Smaller hover size for faster rendering
                    }
                },
                colors: ['#1894ba'],

            },
            categoriesC: [
                '00:00',
                '01:30',
                '02:30',
                '03:30',
                '04:30',
                '05:30',
                '06:30'
            ],
            seriesC: [
                {
                    name: "series-1",
                    data: [60, 40, 45, 30, 10, 50, 70, 91],
                },
            ],
            fill: {
                type: "gradient",
                colors: ["#EACB8F"],
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100],
                },
            },
            stroke: {
                width: 0.5,
            },
            imageToggles: [
                { originalSrc: DHW, newSrc: DHW_new, alt: 'DHW', label: 'DHW', toggleState: false },
                { originalSrc: coil, newSrc: coil_new, alt: 'Coil', label: 'Coil', toggleState: false },
                { originalSrc: stack, newSrc: stack_new, alt: 'Stack', label: 'Stack', toggleState: false },
                { originalSrc: pressure, newSrc: pressure_new, alt: 'pressure', label: 'pressure', toggleState: false },
                { originalSrc: returnImg, newSrc: returnImg_new, alt: 'returnImg', label: 'returnImg', toggleState: false },
                { originalSrc: Bleak, newSrc: Bleak_new, alt: 'Bleak', label: 'Bleak', toggleState: false },
                { originalSrc: BPumps, newSrc: BPumps_new, alt: 'BPumps', label: 'BPumps', toggleState: false },
                { originalSrc: Supply, newSrc: Supply_new, alt: 'Supply', label: 'Supply', toggleState: false },
                // Add more image data as needed
            ],
            imageTogglesAir: [
                { originalSrc: co2, newSrc: co2_new, alt: 'co2', label: 'co2', toggleState: false },
                { originalSrc: pmSensor, newSrc: pmSensor_new, alt: 'pmSensor', label: 'pmSensor', toggleState: false },
                { originalSrc: nox, newSrc: nox_new, alt: 'nox', label: 'nox', toggleState: false },
                { originalSrc: voc, newSrc: voc_new, alt: 'voc', label: 'voc', toggleState: false },
            ],
            isPopupOpen: false,
            isPopupOpenIndo: false,
            deselectAllChecked: false,
            selectAllChecked: false,
            totalActuator: 0,
            openActuator: 0,
            closeActuator: 0,
            selectedDate: '',
            selectedMonth: '',
            selectedDay: '',
            datetime: null,
            hideData: false,
        };
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        localStorage.setItem("selectedFloorNo", 1);
        if (parseInt(localStorage.getItem('userId')) === 47) {
            this.setState({
                hideData: true
            })
        }
        this.props.updateBuildingName();
        this.loadDashboard();
        client.subscribe('sensorDataUpdate_new');
        client.subscribe('Assets_ON_OFF');
        this.onMessage(client);
    }


      fetchData() {
        let buildingId = parseInt(localStorage.getItem('activeBuilding'));
        const postData = {
              buildingId: buildingId
        };
        ApiCall(urlMapping.getOutsideTemp(postData), (result) => {
            if (result.status) {
                // console.log("res", result);
                let data = result.data;
            
                const categories = data.map(item => item.time); // Access the data property
                const seriesData = data.map(item => item.temperature); // Access the data property
            
               
                this.setState((prevState) => ({
                  categories,
                  series: [
                    {
                      name: "series-1",
                      data: seriesData
                    }
                  ],
                  options: {
                    ...prevState.options,
                    xaxis: {
                      ...prevState.options.xaxis,
                      categories: categories 
                    }
                  }
                }));
            }
        })    
      }
      
      
    fetchInsideTemp = () => {
        const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m'; // URL for hourly temperature in London

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data && data.hourly && data.hourly.temperature_2m) {
                    const temperatureData = data.hourly.temperature_2m;
                    const categories = data.hourly.time.map(time => new Date(time).toISOString());
                    const seriesData = temperatureData;

                    this.setState({
                        categoriesIn: categories,
                        seriesIn: [ 
                            {
                                name: "series-1",
                                data: seriesData,
                            }
                        ],
                        optionsIn: {
                            ...this.state.optionsIn,
                            xaxis: {
                                ...this.state.optionsIn.xaxis,
                                categories: categories 
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    fetchDHW = () => {
        const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=relative_humidity_2m'; // URL for hourly humidity in London

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data && data.hourly && data.hourly.relative_humidity_2m) {
                    const humidityData = data.hourly.relative_humidity_2m;
                    const categories = data.hourly.time.map(time => new Date(time).toISOString());
                    const seriesData = humidityData;

                    this.setState({
                        categoriesDHW: categories,
                        seriesDHW: [
                            {
                                name: "series-DHW",
                                data: seriesData,
                            }
                        ],
                        optionsDHW: {
                            ...this.state.optionsDHW,
                            xaxis: {
                                ...this.state.optionsDHW.xaxis,
                                categories: categories 
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    fetchCoil = () => {
        const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m'; // URL for hourly temperature in London

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data && data.hourly && data.hourly.temperature_2m) {
                    const temperatureData = data.hourly.temperature_2m;
                    const categories = data.hourly.time.map(time => new Date(time).toISOString());
                    const seriesData = temperatureData;

                    this.setState({
                        categoriesCoil: categories,
                        seriesCoil: [
                            {
                                name: "series-Coil",
                                data: seriesData,
                            }
                        ],
                        optionsCoil: {
                            ...this.state.optionsCoil,
                            xaxis: {
                                ...this.state.optionsCoil.xaxis,
                                categories: categories 
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    fetchStackData = () => {
        const weatherDataURL = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m';

        fetch(weatherDataURL)
            .then(response => response.json())
            .then(weatherData => {
                if (weatherData && weatherData.hourly && weatherData.hourly.length > 0) {
                    const hourlyData = weatherData.hourly;
                    const categories = hourlyData.map(data => data.timestamp); // Assuming timestamp is in ISO format
                    const series = hourlyData.map(data => data.temperature_2m); // Temperature in Celsius

                    this.setState({
                        categoriesStack : categories,
                        seriesStack: [
                            {
                                name: "series-stack",
                                data: series,
                            }
                        ],
                        options: {
                            ...this.state.options,
                            xaxis: {
                                ...this.state.options.xaxis,
                                categories: categories
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    checkAndFetchStackData = () => {
        const lastFetchDate = localStorage.getItem('lastFetchDate');
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        if (lastFetchDate !== currentDate) {
            // If the data is outdated, fetch new data
            this.fetchStackData();
        } else {
            // Use cached data if it is the same day
            const cachedData = JSON.parse(localStorage.getItem('cachedStackData'));
            if (cachedData) {
                this.setState({
                    categoriesStack: cachedData.categories,
                    seriesStack: [
                        {
                            name: "series-Stack",
                            data: cachedData.seriesData,
                        }
                    ],
                    optionsStack: {
                        ...this.state.optionsStack,
                        xaxis: {
                            ...this.state.optionsStack.xaxis,
                            categories: cachedData.categories 
                        }
                    }
                });
            } else {
                // If no cached data, fetch new data
                this.fetchStackData();
            }
        }
    };

    fetchStackData = () => {
        const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=precipitation'; // URL for hourly precipitation in London

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data && data.hourly && data.hourly.precipitation) {
                    const precipitationData = data.hourly.precipitation;
                    const categories = data.hourly.time.map(time => new Date(time).toISOString());
                    const seriesData = precipitationData;

                    // Cache the data in localStorage
                    localStorage.setItem('cachedStackData', JSON.stringify({ categories, seriesData }));
                    localStorage.setItem('lastFetchDate', new Date().toISOString().split('T')[0]);

                    this.setState({
                        categoriesStack: categories,
                        seriesStack: [
                            {
                                name: "series-Stack",
                                data: seriesData,
                            }
                        ],
                        optionsStack: {
                            ...this.state.optionsStack,
                            xaxis: {
                                ...this.state.optionsStack.xaxis,
                                categories: categories 
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };


    /**
* This is the first lifecycle hook
* which will get dahsboard information from api
* and outside temperature details
*/
    componentWillMount() {
        this.getDashboardInfo();
        this.getOutsideTemp();
        this.getRelayReports();
        this.fetchInsideTemp();
        this.fetchDHW();
        this.fetchCoil();
        this.checkAndFetchStackData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        // clearInterval(this.liveTempHum);
        client.unsubscribe('Assets_ON_OFF');
        client.unsubscribe('sensorDataUpdate_new');
    }

    handleRadioChange(event) {
        this.setState({ selectedIndex: parseInt(event.target.value) });
    }

    showMultiBuildingView(e) {
        e.preventDefault();
        localStorage.setItem('dashboard', 'multi');
        this.props.history.push('/dashboard');
    }

    onMessage(client) {
        client.on('message', (topic, message, packet) => {
            let string = JSON.parse(new TextDecoder("utf-8").decode(message));
            let id = string.buildingID;
            if (parseInt(id) === parseInt(localStorage.getItem('activeBuilding'))) {
                let location = window.location.href;
                if (location.includes('dashboard')) {
                    this.getDashboardInfo()
                }
            }
        });
    }

    getRelayReports() {
        let lastHeatOn = "";
        let timezoneName = localStorage.getItem("timezone_name");
        if (!timezoneName) {
            timezoneName = "America/New_York -05:00 EST";
        }
        timezoneName = timezoneName.split(' ')[0];
        let startDate = new Date().toLocaleString("en-US", { timeZone: timezoneName });
        let curtentDate = new Date().toLocaleString("en-US", { timeZone: timezoneName });
        let endDate = new Date().toLocaleString("en-US", { timeZone: timezoneName });

        startDate = new Date(startDate).setHours(0, 0, 0, 0);
        endDate = new Date(endDate).setHours(23, 59, 59, 59);

        let param = {
            "buildingId": localStorage.getItem('activeBuilding'),
            "floorId": 0,
            "apartmentId": 0,
            "roomId": 0,
            "startDate": moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            "endDate": moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
        };

        ApiCall(urlMapping.getRelayReportsForMultiBMU(param), (result) => {
            if (result.relayList && result.relayList.length > 0) {
                let bmuList_val = [];
                let bmu_list = result.relayList;
                for (let i = 0; i < bmu_list.length; i++) {
                    let heatOnArr = [];
                    const element = bmu_list[i];
                    let relayArray = (element.relayList).reverse();
                    if (relayArray.length) {
                        let last = relayArray[relayArray.length - 1];
                        let relay_obj = {
                            sensorData: last.sensorData,
                            time: curtentDate
                        };
                        relayArray.push(relay_obj);
                        for (let index = 0; index < relayArray.length; index++) {
                            if (index + 1 < relayArray.length) {
                                const first_element = relayArray[index];
                                const second_element = relayArray[index + 1];
                                let start_time = new Date(first_element["time"]);
                                let end_time = new Date(second_element["time"]);
                                let start_time1 = moment(first_element["time"]).format("h:mm a");
                                let end_time1 = moment(second_element["time"]).format("h:mm a");
                                var mins = ((end_time.getTime() - start_time.getTime()) / 1000) / 60;
                                let width = ((mins / 1440) * 100).toFixed(2);
                                let status = first_element["sensorData"];
                                let colorVal = 'bg-secondary';
                                let isOn = "";
                                if (status === 1) {
                                    colorVal = 'bg-success';
                                    isOn = "ON";
                                } else if (status === 2) {
                                    colorVal = 'bg-secondary';
                                    isOn = "Manual Off";
                                } else if (status === 3) {
                                    colorVal = 'bg-success';
                                    isOn = "Manual On";
                                } else {
                                    colorVal = 'bg-secondary';
                                    isOn = "OFF";
                                }
                                let obj = {
                                    starttime: start_time1,
                                    endtime: end_time1,
                                    bmu_name: element.bmu_name,
                                    internal_avg_temp: element.internal_avg_temp,
                                    width: { width: width + '%' },
                                    status: status,
                                    color: colorVal,
                                    toolTip: start_time1 + ' - ' + end_time1 + ' - ' + isOn,
                                };
                                lastHeatOn = isOn;
                                heatOnArr.push(obj);
                            }
                        }
                    } else {
                        heatOnArr = [];
                    }

                    let bmulistObj = {
                        bmuMac: element.bmuMac,
                        heatOnArr: heatOnArr,
                        relayMac: element.relayMac,
                        HeatOnLast: lastHeatOn
                    };
                    if (bmulistObj.relayMac.length) {
                        bmuList_val.push(bmulistObj);
                    }
                }
                this.setState({ bmuList: bmuList_val }, () => {
                    this.getOutsideTemp();
                });
            } else {
            }
        });
    }
    loadDashboard() {
        // call to get chart data
        // this.getChartData();
        // this.getDashboardInfo();

        // refresh the date time displayed on first section of page
        this.interval = setInterval(() => {
            let date = moment(new Date())
            let timezoneName = localStorage.getItem("timezone_name");
            if (timezoneName === "null" || timezoneName === null) {
                timezoneName = "America/New_York -05:00 EST";
            }
            let tzName = timezoneName.substr(0, timezoneName.indexOf(' '));
            let datetime = moment.tz(date, tzName).format("h:mm a");
            let selectedDay = moment().tz(tzName).format("dddd");
            let selectedMonth = moment().tz(tzName).format("MMMM");
            let selectedDate = moment().tz(tzName).format("Do");
            this.setState({
                datetime: datetime,
                selectedDate: selectedDate,
                selectedDay: selectedDay,
                selectedMonth: selectedMonth
            })
        }, 1000);
        // Tracks ive Temperature and Humidity
        // this.liveTempHum = setInterval(() => {
        //     this.getDashboardInfo();
        // }, 60000);
    }


    getOutsideTemp() {
        let buildingId = parseInt(localStorage.getItem('activeBuilding'));
        ApiCall(urlMapping.getOutsideWeather(buildingId), (result) => {
            if (result.status) {
                let outTemp = result.data.main.temp;
                outTemp = outTemp.toFixed(1);
                let outHumid = result.data.main.humidity;
                let createdAt = result.data.main.created_at;
                let date = moment(createdAt)
                let timezoneName = localStorage.getItem("timezone_name");
                if (timezoneName === "null" || timezoneName === null) {
                    timezoneName = "America/New_York -05:00 EST";
                }
                let tzName = timezoneName.substr(0, timezoneName.indexOf(' '));
                let datetime = moment.tz(date, tzName).format('MM/DD/YYYY, hh:mm A');
                this.setState({
                    outsideTemperature: outTemp,
                    outsideHumidity: outHumid,
                    lastUpdate: datetime
                })
            }
        })
    }

    togglePopup = () => {
        this.setState(prevState => ({
            isPopupOpen: true
        }));
    };

    handleToggle = (index) => {
        this.setState(prevState => {
            const updatedToggles = [...prevState.imageToggles];
            updatedToggles[index].toggleState = !updatedToggles[index].toggleState;
            return { imageToggles: updatedToggles };
        });
    };

    handleToggleAir = (index) => {
        this.setState(prevState => {
            const updatedToggles = [...prevState.imageTogglesAir];
            updatedToggles[index].toggleState = !updatedToggles[index].toggleState;
            return { imageTogglesAir: updatedToggles };
        });
    };

    handleSelectAll = () => {
        this.setState(prevState => {
            const updatedToggles = prevState.imageToggles.map(image => ({ ...image, toggleState: true }));
            return { imageToggles: updatedToggles };

        });
        this.setState(prevState => {
            const updatedToggles = prevState.imageTogglesAir.map(image => ({ ...image, toggleState: true }));
            return { imageTogglesAir: updatedToggles };
        });
    };

    handleDeselectAll = () => {
        this.setState(prevState => {
            const updatedToggles = prevState.imageToggles.map(image => ({ ...image, toggleState: false }));
            return { imageToggles: updatedToggles };
        });
        this.setState(prevState => {
            const updatedToggles = prevState.imageTogglesAir.map(image => ({ ...image, toggleState: false }));
            return { imageTogglesAir: updatedToggles };
        });
    };

    togglePopupIndo = () => {
        this.setState(prevState => ({
            isPopupOpenIndo: true
        }));
    };



    openModal = () => {
        this.setState(prevState => ({
            isPopupOpen: !prevState.isPopupOpen
        }));
    };

    onClose = () => {
        this.setState(prevState => ({
            isPopupOpen: false
        }));
    };

    onCloseIndo = () => {
        this.setState(prevState => ({
            isPopupOpenIndo: false
        }));
    };


    // SingleBuilding data
    getDashboardInfo() {
        let buildingId = parseInt(localStorage.getItem('activeBuilding'));
        ApiCall(urlMapping.getDashboardDetails(buildingId), (result) => {

            //  if (result.status) {
            let RelayStatus = result.data.RelayStatus;
            let avg_temp = parseInt(result.data.avg_temp);
            let avgHumid = parseInt(result.data.avg_humidity);
            let tempData = [{ "item": "Average", "count": avg_temp }, { "item": "Temperature", "count": 120 - avg_temp }];
            let humidityData = [{ "item": "Average", "count": avgHumid }, { "item": "humidity", "count": 100 - avgHumid }];
            let boiler = result.data.activeBoilerCnt;
            this.setState({
                onlineSmu: result.data.online_smu,
                offlineSmu: result.data.offline_Smu,
                onlineBmu: result.data.onlineBmu,
                offlineBmu: result.data.offlineBmu,
                avgTemp: result.data.avg_temp,
                totalActuator: result.data.totalActuator ? result.data.totalActuator : 0,
                closeActuator: result.data.closedActuator ? result.data.closedActuator : 0,
                openActuator: result.data.openActuator ? result.data.openActuator : 0,
                image: result.data.image,
            }, () => {
                this.getRelayReports();
            })
            // }
        })
    }


    render() {
        const { deselectAllChecked, selectAllChecked, imageToggles, imageTogglesAir } = this.state;
        const { bmuList, selectedIndex } = this.state;
        return (
            <div className='dGraph bg-light'>
                <div className='mt-5 dGraph-main rounded'>
                    <div className='dGraph-main-1 rounded'>
                        <div className='first-sec m-3 bg-light rounded'>
                            <div className='position-relative'>
                                <div className='image-building'>
                                    <img src={this.state.image !== null && this.state.image !== 'building-placeholder.jpg' ? `${envURL}application/api/buildings/getImage/${this.state.image}` : `/images/buildingPlaceholder.jpg`} alt="Building" className="building-img" />
                                </div>
                                {/* {(parseInt(localStorage.getItem("userTypesId")) === 1 || parseInt(localStorage.getItem("userTypesId")) === 0) && localStorage.getItem('dashboard') === 'single' ?
                                                                <img src={backIcon} alt="Back Icon" width={50}  height={40} onClick={(e) => this.showMultiBuildingView(e)} className="back-icon" />
                                                                : ""} */}
                            </div>
                            <div className='d-flex justify-content-between p-2'>
                                <div className='d-flex flex-column'>
                                    <h5 className='font-weight-bold building-name'>{localStorage.getItem('buildingName')}</h5>
                                    <span className='date'>{this.state.selectedDay}, {this.state.selectedMonth}  {this.state.selectedDate}</span>
                                    {/* <div className="date-blk">
                                        <span>{this.state.selectedDay}<span>{this.state.selectedMonth}</span></span>
                                        <span>{this.state.selectedDate}</span>
                                    </div> */}
                                    {/* <div className="time-blk">
                                        <span>{this.state.datetime}</span>
                                    </div> */}
                                </div>
                                <div className='mr-1'>
                                    <img src={timeIcon} alt='' className='mb-1' width={20} height={20} />
                                    <span className='ml-1 text-black'><b>{this.state.datetime}</b></span>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between p-1 smu'>
                                <div className='w-50 d-flex justify-content-between bg-white m-1 p-1 rounded'>
                                    <div className='online-smu-d' />
                                    <span className='d-flex justify-content-center align-items-center text-secondary font-smu '>ONLINE SMU's:</span>
                                    {`${config}` === "Lcu" ?

                                        <Online timeout={1000} interval={1000}>

                                            <span className="d-flex justify-content-center align-items-center font-smu1"><b>{this.state.onlineSmu}</b></span>
                                            {/* <span className="c-text">{localisation.onlineSmu}</span> */}

                                        </Online>

                                        :

                                        <span className="d-flex justify-content-center align-items-center font-smu1"><b>{this.state.onlineSmu}</b></span>

                                    }
                                    {/* <span className='d-flex justify-content-center align-items-center'><b>10</b></span> */}
                                </div>
                                <div className='w-50 d-flex justify-content-between bg-white m-1 p-1 rounded '>
                                    <div className='online-smu-d' />
                                    <span className='d-flex justify-content-center align-items-center text-secondary font-smu'>ONLINE BMU's:</span>
                                    <span className='d-flex justify-content-center align-items-center font-smu1'><b>{this.state.onlineBmu}</b></span>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between p-1'>
                                <div className='w-50 d-flex justify-content-between bg-white m-1 p-1 rounded'>
                                    <div className='offline-smu-d' />
                                    <span className='d-flex justify-content-center align-items-center text-secondary font-smu'>OFFLINE SMU's:</span>
                                    <span className='d-flex justify-content-center align-items-center font-smu1'><b>{this.state.offlineSmu}</b></span>
                                </div>
                                <div className='w-50 d-flex justify-content-between bg-white m-1 p-1 rounded'>
                                    <div className='offline-smu-d' />
                                    <span className='d-flex justify-content-center align-items-center text-secondary font-smu'>OFFLINE BMU's:</span>
                                    <span className='d-flex justify-content-center align-items-center font-smu1'><b>{this.state.offlineBmu}</b></span>
                                </div>
                            </div>
                        </div>
                        <div className='second-sec d-flex flex-column m-3 rounded'>
                            <div className='d-flex flex-wrap justify-content-between p-2 bg-light rounded'>
                                <div className='dGraphBox rounded border-1'>
                                    <div className='h-50 d-flex justify-content-center align-items-center'>
                                        <img src={AvgInsideTemp} alt="" className='mt-4' />
                                    </div>
                                    <div className='h-50 d-flex flex-column justify-content-center align-items-center'>
                                        <div>
                                            <b className='heading-sec2'>Average Indoor Temp</b>
                                        </div>
                                        <div>
                                            <h2 className='font-weight-bold mt-1 value-sec2'>{this.state.avgTemp}<sup>°</sup></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='dGraphBox rounded border-2'>
                                    <div className='h-50 d-flex justify-content-center align-items-center'>
                                        <img src={currentOut} alt="" className='mt-4' />
                                    </div>
                                    <div className='h-50 d-flex flex-column justify-content-center align-items-center parent-div'>
                                        <div className=''>
                                            <b className='heading-sec2'>Current Outdoor Temp</b>
                                        </div>
                                        <div>
                                            <h2 className='font-weight-bold mt-1 value-sec2'>{this.state.outsideTemperature}<sup>°</sup></h2>
                                        </div>
                                        <div className='last-update-date'>
                                            <span className='last-update'>Last Updated : {this.state.lastUpdate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='dGraphBox rounded border-3'>
                                    <div className='h-50 d-flex justify-content-center align-items-center'>
                                        <img src={valueOpen} alt="" className='mt-4' />
                                    </div>
                                    <div className='h-50 d-flex flex-column justify-content-center align-items-center'>
                                        <div>
                                            <b className='heading-sec2'>Valves Opened</b>
                                        </div>
                                        <div className='d-flex'>
                                            <h2 className='font-weight-bold mt-1 value-sec2'>{this.state.openActuator}</h2><span className='d-flex flex-column-reverse pb-2'><b>/{this.state.totalActuator}</b></span>
                                        </div>
                                    </div>
                                </div>
                                <div className='dGraphBox rounded border-4'>
                                    <div className='h-50 d-flex justify-content-center align-items-center'>
                                        <img src={valueClose} alt="" className='mt-4' />
                                    </div>
                                    <div className='h-50 d-flex flex-column justify-content-center align-items-center'>
                                        <div>
                                            <b className='heading-sec2'>Values Closed</b>
                                        </div>
                                        <div className='d-flex'>
                                            <h2 className='font-weight-bold mt-1 value-sec2'>{this.state.closeActuator}</h2> <span className='d-flex flex-column-reverse pb-2'><b>/{this.state.totalActuator}</b></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex h-100 flex-column bg-light mt-4 pl-3 pr-3 rounded'>
                                <div className='d-flex justify-content-between'>
                                    <span className='p-1'><b>{bmuList.length > 0 && bmuList[selectedIndex].heatOnArr.length > 0 &&
                                        bmuList[selectedIndex].heatOnArr[bmuList[selectedIndex].heatOnArr.length - 1].bmu_name}</b></span>
                                    <span className='p-1'>
                                        Inside average Temperature:
                                        {bmuList.length > 0 && bmuList[selectedIndex].heatOnArr.length > 0 &&
                                            bmuList[selectedIndex].heatOnArr[bmuList[selectedIndex].heatOnArr.length - 1].internal_avg_temp}
                                        <sup>°</sup> F
                                    </span>
                                    {bmuList.length > 0 && bmuList[selectedIndex].heatOnArr.slice(-1).map((n, idx) => {
                                        const isOff = n.toolTip.includes("OFF");
                                        const isOn = n.toolTip.includes("ON");
                                        const isManualOn = n.toolTip.includes("Manual On");
                                        const isManualOff = n.toolTip.includes("Manual Off");
                                        return (
                                            <React.Fragment key={idx}>
                                                {isOff && (
                                                    <span className='align-center'>
                                                        <b className='p-1 off-color'>OFF</b>
                                                    </span>
                                                )}
                                                {isOn && (
                                                    <span className='align-center'>
                                                        <b className='p-1 on-color'>ON</b>
                                                    </span>
                                                )}
                                                {isManualOn && (
                                                    <span className='align-center'>
                                                        <b className='p-1 on-color'>MANUAL ON</b>
                                                    </span>
                                                )}
                                                {isManualOff && (
                                                    <span className='align-center'>
                                                        <b className='p-1 off-color'>MANUAL OFF</b>
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                <div>

                                    {bmuList.length > 0 && (
                                        <div className="pbar rounded">
                                            <div className="progress-bar-inner" style={{ width: `${100}%` }}>
                                                <div>
                                                    <div className="progress horizonal-bar">
                                                        {bmuList[selectedIndex].heatOnArr.map((n, idx) => {
                                                            const backgroundColor = n.toolTip.includes("OFF") ? '#ee5b5b' : n.toolTip.includes("ON") ? '#5beec2' : n.toolTip.includes("Manual On") ? '#5beec2' : n.toolTip.includes("Manual Off") ? '#ee5b5b' : '';

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title={n.toolTip}
                                                                    className={`progress-bar`}
                                                                    role="progressbar"
                                                                    style={{ ...n.width, height: '100%', padding: '2px', backgroundColor: backgroundColor }}
                                                                >
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    <div className="d-flex justify-content-center align-items-center p-1">
                                        {bmuList.length > 1 && bmuList.map((item, index) => (
                                            <div key={index}>
                                            <input
                                                id={`radio${index}`}
                                                type="radio"
                                                name="radiogroup"
                                                value={index}
                                                checked={selectedIndex === index}
                                                onChange={this.handleRadioChange}
                                                style={selectedIndex === index ? { ...radioStyle, ...checkedStyle } : radioStyle}
                                            />

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* graph */}
                    <div className='bg-white'>
                        {/* graph-1 */}
                        <div className='bg-white d-flex'>
                        <div className='chart-g ml-3 mr-2 rounded' style={{ background: "rgba(245, 0, 0, 0.1)", border: "2px solid rgba(245, 0, 0, 0.2)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Indoor Temperature(<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1 font">
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopupIndo}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsIn}
                                            series={this.state.seriesIn}
                                            type="area"
                                            width={window.innerWidth * 0.5} height={240}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {this.state.hoveredDateIn && this.state.hoveredValueIn !== null && (
                                                    <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateIn}</span>
                                                )}
                                            </div>
                                            <div className="">
                                                {this.state.hoveredDateIn && this.state.hoveredValueIn !== null && (
                                                    <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueIn}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g ml-3 mr-2 rounded' style={{ background: "rgba(184,246,228,0.7)", border: "2px solid rgba(92,236,188,0.3)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Outdoor Temperature(<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1 ">
                                        <img src={fullScreen}
                                            className="p-1 "
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopupIndo}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.options}
                                            series={this.state.series}
                                            type="area"
                                            width={window.innerWidth * 0.41} height={230}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDate}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValue}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="Divider">
                            <img src={Divider} alt="" />
                            <p className='mt-3 divider-data'>Boiler Data</p>
                            <img src={Divider} alt="" />
                        </div>
                        {/* graph-2 */}
                        <div className='bg-white d-flex mb-4'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(53, 28, 137,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>DHW (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1 font">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsDHW}
                                            series={this.state.seriesDHW}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateDHW}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueDHW}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(43, 247, 244 ,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Coil (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsCoil}
                                            series={this.state.seriesCoil}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateCoil}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueCoil}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(64, 224, 208,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Stack (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsStack}
                                            series={this.state.seriesStack}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateStack}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueStack}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* graph-3 */}
                        <div className='bg-white d-flex flex-wrap mt-4'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(199, 196, 34,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Pressure (PSI)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsPre}
                                            series={this.state.seriesPre}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDatePre}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValuePre}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(185, 43, 247,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Return (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsRe}
                                            series={this.state.seriesRe}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateRe}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueRe}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(117, 33, 16,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Supply (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsSu}
                                            series={this.state.seriesSu}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateSu}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueSu}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* graph-4 */}
                        <div className='bg-white d-flex flex-wrap mt-4'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(16, 117, 23,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Boiler Leak (Gallons)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsB}
                                            series={this.state.seriesB}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateB}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueB}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "1px solid #B92BF7" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Return (<sup>°</sup>F)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div className="graphcontainerout">
                                    <Chart
                                        options={{
                                            // title: {
                                            //     text: "Outside Temp...(F)",
                                            //     style: { fontSize: 20 }
                                            // },
                                            colors: ['#B92BF7'],
                                            stroke: { width: 2, curve: 'smooth' },
                                            fill: {
                                                type: "gradient",
                                                // colors: ["#EACB8F"],
                                                gradient: {
                                                    shadeIntensity: 1,
                                                    opacityFrom: 0,
                                                    opacityTo: 0,
                                                    stops: [0, 90, 100],
                                                },
                                            },
                                            chart: {
                                                height: 500,
                                                type: "area",
                                            },
                                            dataLabels: {
                                                enabled: false,
                                            },
                                            xaxis: {
                                                labels: {
                                                    show: false // Hide x-axis labels
                                                }
                                            },
                                            yaxis: {
                                                show: false // Hide y-axis
                                            },
                                        }}
                                        series={[
                                            {
                                                name: "commits",
                                                data: [345, 27, 121, 676, 98, 321, 0],
                                            },
                                        ]}
                                        type="area"
                                        width={380} height={220}
                                    />

                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 d-flex flex-column justify-content-center align-items-center ml-3 mr-2 rounded bg-light' style={{ background: "#fff" }}>
                                <img src={addDataPoints} className='cursor-pointer' onClick={this.togglePopup} alt='' style={{ cursor: 'pointer' }} />
                                <div className='pt-2'>
                                    <b>Add Data Points</b>
                                </div>
                            </div>
                        </div>
                        <div className="Divider2">
                            <img src={Divider} alt="" />
                            <p className='mt-3 divider-data'>Building Data</p>
                            <img src={Divider} alt="" />
                        </div>
                        {/* graph-5 */}
                        <div className='bg-white d-flex flex-wrap'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(28, 15, 128,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>Leak (Count)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div className="graphcontainerout">
                                    <Chart
                                        options={{
                                            plotOptions: {
                                                bar: {
                                                    borderRadius: 15,
                                                    dataLabels: {
                                                        position: 'top', // Show data labels on top of bars
                                                    },
                                                    fill: {
                                                        colors: ['#1c0f80'], // Fill the bars with one color
                                                        type: "gradient",
                                                        gradient: {
                                                            shadeIntensity: 1,
                                                            opacityFrom: 0.3,
                                                            opacityTo: 0.9,
                                                            stops: [0, 90, 100],
                                                        },
                                                    },
                                                }
                                            },
                                            // title: {
                                            //     text: "Outside Temp...(F)",
                                            //     style: { fontSize: 20 }
                                            // },
                                            colors: ['#1c0f80'],
                                            stroke: { width: 0, curve: 'smooth' },
                                            theme: { mode: 'light' },
                                            chart: {
                                                height: 500,
                                                type: "area",
                                            },
                                            dataLabels: {
                                                enabled: false,
                                            },
                                            xaxis: {
                                                labels: {
                                                    show: false // Hide x-axis labels
                                                }
                                            },
                                            yaxis: {
                                                show: false // Hide y-axis
                                            },
                                        }}
                                        series={[
                                            {
                                                name: "Leak",
                                                data: [345, 270, 350, 500, 550, 321, 200],
                                            },
                                        ]}
                                        type="bar"
                                        width={375} height={240}
                                    />

                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "1px solid #B92BF7", overflow: 'hidden' }}>
                                <video muted loop controls={true} style={{ width: '100%', height: '100%' }}>
                                    <source src={boiler_video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className='chart-g-1 d-flex flex-column justify-content-center align-items-center ml-3 mr-2 rounded bg-light' style={{ background: "#fff" }}>
                                <img src={addDataPoints} className='cursor-pointer' onClick={this.togglePopup} style={{ cursor: 'pointer' }} alt='' />
                                <div className='pt-2'>
                                    <b>Add Data Points</b>
                                </div>
                            </div>
                        </div>
                        <div className="Divider2">
                            <img src={Divider} alt="" />
                            <p className='mt-3'>Air Quality Data</p>
                            <img src={Divider} alt="" />
                        </div>
                        {/* graph-6 */}
                        <div className='bg-white d-flex mb-4'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(255, 87, 51,0.3)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>PM Sensor (ug/m<sup>3</sup>)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div className="graphcontainerout">
                                    <Chart
                                        options={{
                                            // title: {
                                            //     text: "Outside Temp...(F)",
                                            //     style: { fontSize: 20 }
                                            // },
                                            colors: ['#FF5733', '#33FF57', '#5733FF', '#FF5733'],
                                            // colors: ['#351C89'],
                                            stroke: { width: 2, curve: 'smooth' },
                                            fill: {
                                                type: "gradient",
                                                // colors: ["#EACB8F"],
                                                gradient: {
                                                    shadeIntensity: 1,
                                                    opacityFrom: 0,
                                                    opacityTo: 0,
                                                    stops: [0, 90, 100],
                                                },
                                            },
                                            chart: {
                                                height: 500,
                                                type: "area",
                                            },
                                            dataLabels: {
                                                enabled: false,
                                            },
                                            xaxis: {
                                                labels: {
                                                    show: false // Hide x-axis labels
                                                }
                                            },
                                            yaxis: {
                                                show: false // Hide y-axis
                                            },
                                        }}
                                        series={[
                                            {
                                                name: "PM1",
                                                data: [345, 27, 121, 676, 98, 321, 77],
                                            },
                                            {
                                                name: "PM2",
                                                data: [200, 20, 128, 679, 102, 300, 66],
                                            },
                                            {
                                                name: "PM3",
                                                data: [250, 29, 115, 500, 121, 22, 44],
                                            },
                                            {
                                                name: "PM4",
                                                data: [100, 129, 22, 100, 200, 100, 333],
                                            },
                                        ]}
                                        type="area"
                                        width={380} height={180}
                                    />

                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(88, 16, 117,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>VOC (Index)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsV}
                                            series={this.state.seriesV}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateV}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueV}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(16, 117, 69 ,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>NOx (Index)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsN}
                                            series={this.state.seriesN}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateN}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueN}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* graph-7 */}
                        <div className='bg-white d-flex flex-wrap pb-3'>
                            <div className='chart-g-1 ml-3 mr-2 rounded' style={{ background: "#fff", border: "2px solid rgb(24, 148, 186,0.4)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className='font-weight-bold p-3 font-weight-bold1'>CO2 (ppm)</h5>
                                    <div className="d-flex p-3 font1">
                                        <img src={sideScreen}
                                            className="p-1 mr-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={this.togglePopup}
                                            alt=''
                                        />
                                        <img src={fullScreen}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            alt=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="graphcontainerout">
                                        <Chart
                                            options={this.state.optionsC}
                                            series={this.state.seriesC}
                                            type="area"
                                            width={550} height={220}
                                        />
                                    </div>
                                    <div>
                                        <div className='valesOn-graph'>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="ml-2 font-weight-bold letter-spacing">{this.state.hoveredDateC}</span>
                                                {/* )} */}
                                            </div>
                                            <div className="">
                                                {/* {this.state.hoveredDate && this.state.hoveredValue !== null && ( */}
                                                <span className="mr-2 font-weight-bold letter-spacing">{this.state.hoveredValueC}</span>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.isPopupOpen && (
                                    // Your popup component goes here
                                    <div className="popup">
                                        Popup Content
                                    </div>
                                )}
                            </div>
                            <div className='chart-g-1 d-flex flex-column justify-content-center align-items-center ml-3 mr-2 rounded bg-light' style={{ background: "#fff" }}>
                                <img src={addDataPoints} className='cursor-pointer' onClick={this.togglePopup} style={{ cursor: 'pointer' }} alt='' />
                                <div className='pt-2'>
                                    <b>Add Data Points</b>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {this.state.isPopupOpen && (
                    // Your popup component goes here
                    <div className="modal-overlay">
                        <div className="Smodal-content">
                            <div className="adddatatop">
                                <h5>Add Data Points</h5>
                                <div className="checkbox-wrapper-1">
                                    <input
                                        id="deselectAll"
                                        className="substituted"
                                        type="checkbox"
                                        checked={deselectAllChecked}
                                        onChange={this.handleDeselectAll}

                                    />
                                    <label htmlFor="deselectAll">Deselect All</label>
                                </div>
                                <div className="checkbox-wrapper-2">
                                    <input
                                        id="selectAll"
                                        className="substituted"
                                        type="checkbox"
                                        checked={selectAllChecked}
                                        onChange={this.handleSelectAll}

                                    />
                                    <label htmlFor="selectAll">Select All</label>
                                </div>
                            </div>

                            <div className="">
                                <div className='p-3'>Boiler Data</div>
                                <div class="d-flex flex-wrap">
                                    {imageToggles.map((image, index) => (
                                        <ImageToggle
                                            key={index}
                                            {...image}
                                            handleToggle={() => this.handleToggle(index)}
                                        />
                                    ))}
                                    {/* <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={DHW} />
                                        <p>DHW</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={coil} />
                                        <p>Coil</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2  p-2">
                                        <img src={stack} />
                                        <p>Stack</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={pressure} />
                                        <p>Pressure</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={returnImg} />
                                        <p>Return</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={Bleak} />
                                        <p>Boiler Leak</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={BPumps} />
                                        <p>Boiler/Pumps</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={Supply} />
                                        <p>Supply</p>
                                    </div> */}
                                </div>
                                <div className='p-3 divider-data'>Air Quality Data</div>
                                <div class="d-flex flex-wrap">
                                    {imageTogglesAir.map((image, index) => (
                                        <ImageToggle
                                            key={index}
                                            {...image}
                                            handleToggle={() => this.handleToggleAir(index)}
                                        />
                                    ))}
                                    {/* <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={co2} />
                                        <p>CO<sub>2</sub></p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={pmSensor} />
                                        <p>PM Sensor</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2  p-2">
                                        <img src={nox} />
                                        <p>NOx</p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center ml-2 mr-2 p-2">
                                        <img src={voc} />
                                        <p>VOC</p>
                                    </div> */}
                                </div>
                            </div>
                            <hr />
                            <div className="adddatalast">
                                <button id="canclebtn" className="closebutton" onClick={this.onClose}>
                                    CANCEL
                                </button>
                                <button id="savebtn" className="closebutton" onClick={this.onClose}>
                                    SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.isPopupOpenIndo && (
                    // Your popup component goes here
                    <div className="popupIndo">
                        <div className='Indo-temp rounded'>
                            <div className='d-flex justify-content-between'>
                                <h5 className='m-3 font-weight-bold'>Indoor Temperature</h5>
                                <img src={cancelIcon} className='m-3' width={25} height={25} onClick={this.onCloseIndo} alt='' style={{ cursor: 'pointer' }} />
                            </div>
                            <div className='d-flex justify-content-center align-items-center bg-light'>
                                <div className='dropdown-Indo'>
                                    <span>Select Floor</span>
                                    <span><img src={down_arrow} alt='' /></span>
                                </div>
                                <div className='dropdown-Indo'>
                                    <span>Select User Space</span>
                                    <span><img src={down_arrow} alt='' /></span>
                                </div>
                                <div className='dropdown-Indo'>
                                    <span>Select Room</span>
                                    <span><img src={down_arrow} alt='' /></span>
                                </div>
                            </div>
                            <div className='d-flex'>
                                <div className="border-right p-2">
                                    <div className='Indo-area m-2'>
                                        <div className='d-flex justify-content-between p-2' style={{ backgroundColor: '#03cafc', borderTopRightRadius: '6px', borderTopLeftRadius: '6px' }}>
                                            <span className='ml-2'><b>Area</b></span>
                                            <span><b>Temp<sup>°</sup></b></span>
                                        </div>
                                        <div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 1 <span className='ml-4 text-danger'>70<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 2 <span className='ml-4 text-success'>10<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 3 <span className='ml-4 text-primary'>60<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 4 <span className='ml-4 text-success'>40<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 1 <span className='ml-4 text-danger'>70<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 2 <span className='ml-4 text-success'>10<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 3 <span className='ml-4 text-primary'>60<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 4 <span className='ml-4 text-success'>40<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 1 <span className='ml-4 text-danger'>70<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 2 <span className='ml-4 text-success'>10<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 3 <span className='ml-4 text-primary'>60<sup>°</sup></span>
                                                </label>
                                            </div>
                                            <div class="form-check m-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox1" />
                                                <label class="form-check-label" for="checkbox1">
                                                    Room Demo 4 <span className='ml-4 text-success'>40<sup>°</sup></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* graph */}
                                <div>
                                    <div className="m-3 pt-2 border" style={{ background: "rgba(245, 0, 0, 0.1)", border: "2px solid rgba(245, 0, 0, 0.2)" }}>
                                        <Chart
                                            options={{
                                                // title: {
                                                //     text: "Outside Temp...(F)",
                                                //     style: { fontSize: 20 }
                                                // },
                                                colors: ['#f90000'],
                                                stroke: { width: 2, curve: 'smooth' },
                                                chart: {
                                                    // id: "basic-bar",
                                                    height: 500,
                                                    type: "area",
                                                },
                                                dataLabels: {
                                                    enabled: false,
                                                },
                                                xaxis: {
                                                    labels: {
                                                        show: true // Hide x-axis labels
                                                    }
                                                },
                                                yaxis: {
                                                    show: true // Hide y-axis
                                                },
                                            }}

                                            // options={{
                                            //     title:{
                                            //         text:"Outside Temp...(F)",
                                            //         style:{fontSize:20}
                                            //     },
                                            //          colors:['#f90000']
                                            // }} 
                                            series={[
                                                {
                                                    name: "Temperature",
                                                    data: [60, 70, 65, 80, 75, 90],
                                                },

                                            ]}
                                            type="area"
                                            width={650} height={350} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default SingleBuilding;
