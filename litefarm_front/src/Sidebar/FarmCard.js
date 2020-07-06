import React from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import './FarmCard.css'
function FarmCard({ farm, activeFarm ,updateActiveFarm }) {
    return (
        <Row>
            <Card variant='dark' className={`mw-100 clickable${activeFarm.id === farm.id ? ' active' : ''}`} onClick={() => updateActiveFarm(farm)}>
                <Card.Body>
                    <Card.Title>{farm.name}</Card.Title>
                    <Card.Text>
                        {farm.address_name}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Row>
    )
}

export default FarmCard;