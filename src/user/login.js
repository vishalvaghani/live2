import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';



function Loginuser() {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [loginDisabled, setloginDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();


    const handleSave = async (e) => {
        var inputdata = {
            username: username,
            password: password
        }
        debugger
        try {
            debugger;
            const res = await axios.get("http://localhost:8801/user/" + username);

            if (res.data.length === 0) {
                alert('Username Not Valid');
                navigate("/");
            } else {
                debugger
                var user_id = res.data[0].user_id;
                try {
                    debugger;
                    const res = await axios.get("http://localhost:8801/userdata/" + user_id +"/"+ password);
                    debugger;
                    if (res.data) {
                        navigate("/user");
                        formclear();
                    } else {
                        alert("Enter Wrong Password...");
                    }
                } catch (error) {
                    alert(error.message)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    function formclear() {
        setusername('');
        setpassword('');
    }

    useEffect(() => {
        if (username && password) {
            setloginDisabled(false);
        } else {
            setloginDisabled(true);
        }

    }, [username, password]);
    return (
        <>
            <Container style={{ display: 'flex', justifyContent: 'center' }}>
                <Form style={{ width: '500px', border: '2px solid gray' }} >
                    <Table>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <td colSpan={2}>USER LOGIN HERE...</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Username</td>
                                <td><Form.Control onChange={(e) => setusername(e.target.value)} required defaultValue={username} type='text' name='username' placeholder='Enter usename'></Form.Control></td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td><Form.Control onChange={(e) => setpassword(e.target.value)} required type='password' name='password' value={password} placeholder='Enter password'></Form.Control></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><Button variant="primary" type="button" disabled={loginDisabled} onClick={() => handleSave()}>Login</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Form>
            </Container>
        </>
    )
}
export default Loginuser;