import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useState } from 'react';
import { getFarms, createFarm } from './service'
import FarmCard from './FarmCard';
import './Sidebar.css';
import AddFarm from './AddFarm';

function Sidebar({ user, activeFarm, updateActiveFarm }) {
    const alertInitialState = { message: '', show: false, type: 'success' };
    const initialFarmForm = { name: null, address_id: null, address_name: null, measure_system: null, farmer_id: user.id };
    const [addingFarm, changeToFarmAddView] = useState(false);
    const [farmForm, changeFarmForm] = useState(initialFarmForm);
    const [sideBarSize, updateSize] = useState(3);
    const [alertMessage, changeAlertMessage] = useState(alertInitialState);
    const [farmList, updateFarmList] = useState([]);
    

    useEffect(() => {
        getFarms(user.id).then(getFarmHandler)
    }, [user.id]);

    useEffect(() => {
        const size = addingFarm ? 4 : 3;
        updateSize(size);
    }, [addingFarm]);

    function isFarmDataValid() {
        return ['name', 'address_id', 'measure_system'].every(key => !!farmForm[key])
    }

    function getFarmHandler({data}) {
        if(data.length){
            updateActiveFarm(data[0]);
            updateFarmList(data);
        }
    }

    function addFarmHandler() {
        if (addingFarm) {
            if (isFarmDataValid()) {
                createFarm(farmForm).then(() => {
                    changeToFarmAddView(false);
                    changeFarmForm({...initialFarmForm});
                    showFarmSuccessMessage();
                    getFarms(user.id).then(getFarmHandler)
                }).catch(() => {
                    showFarmCreateMessage();
                })
            } else {
                showFarmCreateMessage();
            }
            return;
        }
        changeToFarmAddView(true)
    }

    function showFarmCreateMessage() {
        changeAlertMessage({ show: true, message: 'There was a problem creating your farm, check your data and try again.', type: 'danger' });
        gracefullyHideAlert();
    }

    function showFarmSuccessMessage() {
        changeAlertMessage({ show: true, message: 'Your farm was created successfully', type: 'success' });
        gracefullyHideAlert();
    }

    function gracefullyHideAlert() {
        setTimeout(() => {
            changeAlertMessage(alertInitialState);
        }, 4000)
    }

    return (
        <Col sm={sideBarSize} className="blue-bordered ">
            <div className="full-height">
                <Row>
                    {
                        addingFarm &&
                        <Col sm={{ span: 8, offset: 2 }}>
                            <AddFarm farmForm={farmForm} changeFarmForm={changeFarmForm}></AddFarm>
                        </Col>
                    }
                    <Col sm={{ span: 8, offset: 2 }}>
                        {
                            addingFarm &&
                            <Button variant="danger" className="mt-1" onClick={() => changeToFarmAddView(false)}>X</Button>
                        }
                        <Button variant="success" className="stretch mt-1" disabled={!isFarmDataValid() && addingFarm} onClick={addFarmHandler}>Add Farm</Button>
                        {
                            alertMessage.show &&
                            <Alert className="mt-1" variant={alertMessage.type}>{alertMessage.message}</Alert>
                        }
                    </Col>
                </Row>
                <br></br>
                {
                    farmList.map((farm, index) => (
                        <FarmCard key={`${index}-farm-card`} farm={farm} activeFarm={activeFarm} updateActiveFarm={updateActiveFarm}>
                        </FarmCard>
                    ))
                }
            </div>
        </Col>
    );
}


export default Sidebar;