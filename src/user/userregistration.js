import React, { useEffect, useState } from "react";
import '../index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";


function Userregistration() {

    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [gender, setgender] = useState('');
    const [email, setemail] = useState('');
    const [contact, setcontact] = useState('');
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');
    const [astatus, setastatus] = useState(0);
    const [saveDisabled, setsavaeDisabled] = useState(true);
    const [userdata,setuserdata] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    function getfirstname(e) {
        setfirstname(e.target.value);
    }
    function getlastname(e) {
        setlastname(e.target.value);
    }
    function getgender(e) {
        setgender(e.target.value);
    }
    function getemail(e) {
        setemail(e.target.value);
    }
    function getcontact(e) {
        setcontact(e.target.value);
    }
    async function getusername (e) {

        debugger
        try {
            const res = await axios.get("http://localhost:8801/user/" + username);
        
            if (res.data.length === 0) {
                
            } else {
                alert('Username already Exist');
            }
        } catch (err) {
            console.log(err);
        }
    }
    function getpassword(e) {
        setpassword(e.target.value);
    }
    function getcpassword(e) {
        if (e.target.value !== password) {
            setsavaeDisabled(true);
            alert('Confirm Passwrod Not Match');

        } else {
            setcpassword(e.target.value);
        }
    }
    function getastatus(e) {

        setastatus(e.target.checked ? 1 : 0);
        debugger;
    }
    function formclear() {
        setfirstname('');
        setlastname('');
        setgender('');
        setemail('');
        setcontact('');
        setusername('');
        setpassword('');
        setastatus(0);
    }
    
    const handleSave = async (e) => {
        
        var inputdata = {
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            email: email,
            contact: contact,
            username: username,
            password: password,
            isactive: astatus
        }
        debugger;
        try {
            const res = await axios.post("http://localhost:8801/user", inputdata);
            navigate("/");
            formclear();
            alert(res.data.message);
            fetchAlluser();
            debugger;

        } catch (error) {
            alert(error.message)
        }
    }

    const isactivehandle = async (user_id,isactivehandle) => {
            
            debugger
            var updatedata = {
                isactive : parseInt((isactivehandle === 0 ) ? 1 : 0)
            }
            debugger
             try {

                const res = await axios.put("http://localhost:8801/user/" + user_id,updatedata);
                debugger;
                console.log(res);
                navigate("/");
                fetchAlluser();

            } catch (err) {
                console.log(err);
            }
   }

    const fetchAlluser = async () => {
        try {
            const res = await axios.get("http://localhost:8801/user");
            console.log(res);
            setuserdata(res.data);
        } catch (err) {
            console.log(err);

        }
    };
    useEffect(() => {
        if(firstname && lastname && gender && contact && username && password && cpassword){
            setsavaeDisabled(false);
        }else{
            setsavaeDisabled(true);
        }
        fetchAlluser();

    }, [firstname, lastname, gender, contact, username, password, cpassword]);
    return (
        <>
            <Container>
                <ToastContainer />
                <h2>Student Form</h2>
                <Form id='Sform'>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>First Name:</Form.Label>
                                <Form.Control onChange={getfirstname} required type='text' name='firstname' value={firstname} placeholder='Enter user firstname'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Last Name:</Form.Label>
                                <Form.Control onChange={getlastname} required type='text' value={lastname} name='lastname' placeholder='Enter user lastname'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label >Gender:</Form.Label><br></br>
                                <Form.Check inline onChange={getgender} required type='radio' name='Gender' checked={gender.includes('Male')} value='Male' label='Male' />
                                <Form.Check inline onChange={getgender} required name='Gender' type='radio' checked={gender.includes('Female')} value='Female' label='Female' />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Email Id:</Form.Label>
                                <Form.Control onChange={getemail} required type='email' name='email' value={email} placeholder='Enter user Email ID'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Contact :</Form.Label>
                                <Form.Control onChange={getcontact} type='text' name='contact' value={contact} placeholder='Enter user Contact'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Username :</Form.Label>
                                <Form.Control onChange={(e)=>setusername(e.target.value)} required onBlur={()=>getusername()} defaultValue={username} type='text' name='username' placeholder='Enter usename'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Password :</Form.Label>
                                <Form.Control onChange={getpassword} required type='password' name='password' value={password} placeholder='Enter password'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Confirm Password :</Form.Label>
                                <Form.Control onBlur={getcpassword} required type='password' name='cpassword' placeholder='Enter Confirm password'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label></Form.Label>
                                <Form.Check onChange={getastatus} name="astatus" checked={astatus === 0 ? false : true} type='checkbox' label='Status' />
                            </Form.Group>
                        </Col>
                    </Row><br></br>
                    <Row>
                        <Col>
                            <Button variant="primary" disabled={saveDisabled} onClick={() => handleSave()}>Save</Button>
                        </Col>
                    </Row>
                </Form>
            </Container><br></br>
            <Container>
                <Table striped style={{border : '2px solid gray'}}>
                    <thead>
                        <tr>
                            <th>FirstName</th>
                            <th>Lastname</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userdata.map((item) => 
                            <tr>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.gender}</td>
                            <td>{item.email}</td>
                            <td>{item.contact}</td>
                            <td>{item.username}</td>
                            <td><span className={item.isactive === 0 ? 'inactive' : 'active'}></span></td>
                            <td><Button onClick={() => isactivehandle(item.user_id,item.isactive)} className="acttionbutton" variant={item.isactive === 0 ? 'success' : 'danger'}>{item.isactive === 0 ? 'activate' : 'deactivate'}</Button></td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}
export default Userregistration;