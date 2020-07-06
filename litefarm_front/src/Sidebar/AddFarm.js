/*global google*/
import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import { MeasureSystem } from './../config/globals';

function AddFarm({ farmForm, changeFarmForm }) {
    let autocomplete;
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('address_google'), {
        fields: ['place_id', 'name', 'types']
    });
    autocomplete.addListener('place_changed', () => {
        const { place_id, name } = autocomplete.getPlace();
        const [address_id, address_name] = [place_id, name];
        changeFarmForm({ ...farmForm, address_id, address_name });
    });
    function dataChangeHandler(property) {
        return (event) => {
            changeFarmForm({ ...farmForm, [property]: event.target.value });
        }
    }

    return (
        <Form>
            <Form.Group>
                <Form.Label>Farm Name</Form.Label>
                <Form.Control type="text" placeholder="Enter farm name" onChange={dataChangeHandler('name')} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Farm Address</Form.Label>
                <Form.Control id="address_google" type="text" placeholder="Address" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Measurement System</Form.Label>
                <Form.Control as="select" custom onChange={dataChangeHandler('measure_system')}>
                    <option value={null}></option>
                    <option value={MeasureSystem.METRIC}>Metric</option>
                    <option value={MeasureSystem.IMPERIAL}>Imperial</option>
                </Form.Control>
            </Form.Group>
        </Form>
    )
}

export default AddFarm;