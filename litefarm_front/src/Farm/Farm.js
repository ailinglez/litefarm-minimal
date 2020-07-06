/*global google*/
import React, { useEffect, useState } from 'react';
import './Farm.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { MeasureSystem } from './../config/globals';
import { createField, getFields } from './service';

function Farm({ farm , updateActiveFarm}) {
    const newFieldBaseData = { name: null, total_area: '', points: null, farm_id: farm.id }
    const [mainMap, updateMap] = useState(null);
    const [mainDrawingManager, setDrawingManager] = useState(null);
    const [newField, updateNewField] = useState(newFieldBaseData);
    const [drawing, updateDrawingStatus] = useState(false);
    const [newFieldValid, updateFieldValidity] = useState(false);
    const [fieldList, updateFieldList] = useState([]);
    const [totalAreaInput, updateTotalAreaInput] = useState('');
    const [totalAreaCalculation, updateTotalAreaCalculation] = useState(' No fields to measure');
    const SQM2TOSQFT = 10.764;


    useEffect(() => {
        geocodePlaceId();
        activateDrawingMode(false);
        setDrawingManager(null);
        updateTotalAreaInput('');
        updateNewField(newFieldBaseData);
        updateTotalAreaCalculation('No fields to measure');
        if(fieldList) {
            fieldList.forEach(({polygon}) => polygon.setMap(null));
        }
        updateFieldList([]);
        getFields(farm.id).then(fieldListHandler);
    }, [farm])

    useEffect(() => {
        if (drawing) {
            activateDrawingMode();
        } else if (mainDrawingManager) {
            mainDrawingManager.setMap(null);
            setDrawingManager(null);
        }
    }, [drawing])

    useEffect(() => {
        if(fieldList.length && mainMap) {
            fieldList.forEach(({polygon = null}) => {
                if(polygon) {
                    polygon.setMap(mainMap);
                }
            })
            let totalArea = fieldList.reduce((sum, f) => f.total_area + sum , 0);
            totalArea = getConvertedArea(totalArea);
            updateTotalAreaCalculation(totalArea)

        }
    }, [fieldList, mainMap])

    useEffect(() => {
        updateFieldValidity(Object.keys(newField).every((k) => !!newField[k]))
    }, [newField])

    function dataChangeHandler(property) {
        return (event) => {
            updateNewField({ ...newField, [property]: event.target.value })
        }
    }


    function geocodePlaceId() {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId: farm.address_id }, function (results, status) {
            if (status === "OK") {
                if (results[0]) {
                    let map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 15,
                        center: results[0].geometry.location
                    });
                    let infowindow = new google.maps.InfoWindow();
                    let marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    updateMap(map);
                } else {
                    console.error('No results found for that place id');
                }
            }
        });
    }

    function activateDrawingMode() {
        let drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']
            }
        });
        drawingManager.setMap(mainMap);
        setDrawingManager(drawingManager);
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            if (event.type === 'polygon') {
                const points = { data: [] };
                event.overlay.getPath().forEach((value, i) => {
                    points.data[i] = {};
                    points.data[i].lat = value.lat();
                    points.data[i].lng = value.lng();
                });
                const total_area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
                updateTotalAreaInput(getConvertedArea(total_area));
                const newData = { points, total_area };
                updateNewField((prevState) => ({ name: prevState.name, farm_id: prevState.farm_id, ...newData }));
            }
        });

    }

    function getConvertedArea(area) {
        if (farm.measure_system === MeasureSystem.IMPERIAL) {
            return (area * SQM2TOSQFT).toFixed(2) + ' ft2';
        }
        return area.toFixed(2) + ' m2';
    }

    function createFieldHandler() {
        createField(newField).then(() => {
            updateNewField(newFieldBaseData);
            updateDrawingStatus(false);
            return getFields(farm.id).then(fieldListHandler)
        });
    }

    function fieldListHandler({ data }) {
        data.forEach((field) => {
            field.color = randomColor();
            field.polygon = new google.maps.Polygon({
                paths: field.points.data,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: field.color,
                fillOpacity: 0.35
            });
        })
        updateFieldList(data);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function randomColor() {
        const R = getRandomInt(1, 255);
        const G = getRandomInt(1, 255);
        const B = getRandomInt(1, 255);
        return `#${R.toString(16)}${G.toString(16)}${B.toString(16)}`
    }

    return (
        <div className="mt-5 pd-15 mh-80 overflow-scroll">
            <h4>Selected farm: {farm.name}</h4>
            <section>
                <p> Located in: {farm.address_name} </p>
                <b> Total Area:{ totalAreaCalculation }
                </b>
            </section>
            <div id="map" className="bg-g">
            </div>
            <br></br>
            <Row>
                <Col xs={5}>
                    {
                        drawing && (
                            <Form.Control type="text" onChange={dataChangeHandler('name')} placeholder="Field Name" />
                        )
                    }
                </Col>
                <Col xs={3}>
                    {
                        drawing && (
                            <Form.Control readOnly value={totalAreaInput} placeholder="Total Area" />
                        )
                    }
                </Col>
                <Col>
                    {
                        !drawing && (
                            <Button className="create-field" variant="primary" onClick={() => updateDrawingStatus(true)}>Create a Field</Button>
                        )
                    }{drawing && (
                        <ButtonGroup className="create-field">
                            <Button variant="danger" onClick={() => updateDrawingStatus(false)} >Clear</Button>
                            <Button variant="primary" disabled={!newFieldValid} onClick={() => createFieldHandler()}>Create Field</Button>
                        </ButtonGroup>
                    )
                    }
                </Col>
            </Row>
            {fieldList.map((field, index) => (
                <Row key={`farm-${index}`} className="mt-5 ">
                    <Col xs={5}>
                        <Form.Control  readOnly value={field.name} />
                    </Col>
                    <Col xs={2}>
                        <Form.Control readOnly value={getConvertedArea(field.total_area)} />
                    </Col>
                    <Col xs={1}>
                        <div style={{backgroundColor: field.color}} className="w-30 h-30">

                        </div>
                    </Col>
                </Row>
            )
            )}
        </div>
    );
}


export default Farm;