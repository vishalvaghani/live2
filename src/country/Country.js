import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";

function CountryList() {
    const [country,setcountry] = useState('');
    const [state,setstate] = useState('');
    const [city,setcity] = useState('');
    const [availablestate, setavailablestate] = useState([])
    const [availablecity, setavailablecity] = useState([])
    const [allContry, setallcountry] = useState([]);
    const [alladdress, setalladdress] = useState([]);
    const [action, setaction] = useState('Save')
    const navigate = useNavigate();
    const location = useLocation();
    const [aid,setaid] = useState('');

    const fetchAlladdress = async () => {
        try {
            const res = await axios.get("http://localhost:8801/getaddress");
            console.log(res);
            setalladdress(res.data);
        } catch (err) {
            console.log(err);

        }
    };

    const fetchAllCountry = async () => {
        try {
            const res = await axios.get("http://localhost:8801/country");
            console.log(res);
            setallcountry(res.data);
        } catch (err) {
            console.log(err);

        }
    };
    useEffect(() => {
        fetchAllCountry();
        fetchAlladdress();

    }, []);

    const fetchstate = async (id) => {
        debugger
        try {
            const res = await axios.get("http://localhost:8801/country/" + id);
            console.log(res);
            setavailablestate(res.data);
        } catch (err) {
            console.log(err);

        }
    };

    const fetchcity = async (id) => {
        debugger
        try {
            const res = await axios.get("http://localhost:8801/state/" + id);
            console.log(res);
            setavailablecity(res.data);
        } catch (err) {
            console.log(err);

        }
    };

    function selectCountry(e) {
        setcountry(e.target.value);
        setavailablecity([]);
        if (e.target.value == "0") {
            setavailablestate([]);
            setavailablecity([]);
        } else {
            fetchstate(e.target.value);
        }
    }
    function selectstate(e) {
        setavailablecity([]);
        setstate(e.target.value);
        fetchcity(e.target.value);
    }
    function selectcity(e){
        setcity(e.target.value);
    }
    const handleSave = async () => {
            var datarecord = {
                country_id:country,
                state_id:state,
                city_id:city,
            }
            debugger
            if (action === 'Save'){
            try {
                debugger
                const res = await axios.post("http://localhost:8801/address", datarecord);
                debugger;
                console.log(res);
                fetchAlladdress();
                setavailablecity([]);
                setavailablestate([]);
                setallcountry([]);
                fetchAllCountry();
            } catch (err) {
                debugger
                console.log(err);
            }
        }else{
            try {
                var res = await axios.put('http://localhost:8801/address/' + aid, datarecord)
                debugger
                alert(res.data.message);
                setaid('');
                fetchAlladdress();
                setavailablecity([]);
                setavailablestate([]);
                setallcountry([]);
                fetchAllCountry();
                setaction('Submit');

            } catch (error) {
                alert(error.message)
            }
        }
        }

    const handleDelete = async (id) => {
        debugger
        try {
            const res = await axios.delete("http://localhost:8801/address/" + id);
            debugger
            alert(res.data.message)
            // toast.success(res.data.message);
            fetchAlladdress();
        } catch (err) {
            console.log(err);
        }
    };
    const updateData = async (aid,cid,sid,ctid) => {
        debugger
        setaction('Update');
        setaid(aid);
        setcountry(cid);
        setstate(sid);
        fetchstate(cid);
        setcity(ctid);
        fetchcity(sid);
        fetchAlladdress();
    }
    document.title = "Country List";
    return (
        <>
            <Container>
                <h2>DropDown List</h2>
                Country : <select onChange={selectCountry} value={country}>
                    <option value="0">Select Country</option>
                    {allContry.map(val => <option value={val.country_id}> {val.country_name} </option>)}
                </select><br></br>
                State : <select onChange={selectstate} value={state}>
                    <option value="0">Select State</option>
                    {availablestate.map(val => <option value={val.state_id}>{val.state_name}</option>)}
                </select><br></br>
                City : <select onChange={selectcity} value={city}>
                    <option value="0">Select City</option>
                    {availablecity.map(val => <option value={val.city_id}>{val.city_name}</option>)}
                </select><br></br><br></br>
                <Button onClick={() => handleSave()}>{action}</Button>
                <br></br><br></br>
                <Container>
                    <Table striped border={2} hover class="table table-lg">
                        <thead>
                            <tr>
                                <th>Country</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alladdress.map((item) =>
                                <tr>
                                    <td>{item.country_name}</td>
                                    <td>{item.state_name}</td>
                                    <td>{item.city_name}</td>
                                    <td><Button value={item.address_id} onClick={() => updateData(item.address_id,item.country_id,item.state_id,item.city_id)} >Edit</Button>
                                        <Button value={item.address_id} onClick={() => handleDelete(item.address_id)}>Delete</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </>
    )
}
export default CountryList;