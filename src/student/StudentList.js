import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";


function StudentList() {
    const [action, setaction] = useState('Submit')
    const [id, setid] = useState('');
    const [name, setname] = useState('');
    const [gender, setgender] = useState('');
    const [college, setcollege] = useState('');
    const [subject, setsubject] = useState([]);
    const [stream, setstream] = useState('Select Strea');
    const [idDisabled, setidDisabled] = useState(false)
    const [deleteDisabled, setDeleteDisabled] = useState(false)
    // setDeleteDisabled(deleteDisabled !== undefined ? 'false' : 'true')
    const [tableData, settableData] = useState([])
    const [selectDeleteData, setSelectDeleteData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    function getid(e) {
        setid(e.target.value);
    }
    function getname(e) {
        setname(e.target.value);
    }
    function getgender(e) {
        setgender(e.target.value);
    }
    function getcollege(e) {
        setcollege(e.target.value);
    }

    function getsubject(e) {
        if (e.target.checked) {
            setsubject([...subject, e.target.value])
        } else {
            setsubject(subject.filter((item) => item !== e.target.value))
        }
    }
    function GetStream(e) {
        setstream(e.target.value);
    }
    function GetDeleteData(e) {
        debugger
        if (e.target.checked) {
            setSelectDeleteData([...selectDeleteData, parseInt(e.target.value)])
        } else {
            setSelectDeleteData(selectDeleteData.filter((item) => item !== parseInt(e.target.value)))
        }
    }
    const fetchAllStudent = async () => {
        try {
            const res = await axios.get("http://localhost:8801/student");
            console.log(res);
            settableData(res.data);
        } catch (err) {
            console.log(err);

        }
    };
    const [show, setShow] = useState(false);
    const [viewdata, setviewdata] = useState(['']);
    const handleClose = () => setShow(false);
    const viewStudent = async (id) => {
        try {
            const res = await axios.get("http://localhost:8801/student/" + id);
            debugger
            setviewdata(res.data);
            setShow(true);

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        document.title = "Student List";
        fetchAllStudent();

    }, []);

    function formclear() {
        //toast.success("Data Submit Successfully");
        setid('');
        setname('');
        setgender('');
        setcollege('');
        setsubject([]);
        setstream('');
    };
    const handleSave = async (e) => {
        debugger

        var student = {
            id: id,
            name: name,
            gender: gender,
            college: college,
            subject: subject.join(','),
            stream: stream
        };
        if (student.id === '' ||
            student.name === '' ||
            student.gender === '' ||
            student.college === '' ||
            student.subject === '' ||
            student.stream === ''
        ) {
            toast.warning("Enter All Valid Data");
        } else if (action === 'Submit') {
            try {
                var res = await axios.post('http://localhost:8801/student', student)
                debugger
                navigate("/");
                fetchAllStudent();
                formclear();
                if ('sqlMessage' in res.data) {
                    toast.warning(res.data.sqlMessage);
                } else {
                    toast.success(res.data.message);
                }

            } catch (error) {
                alert(error.message)
            }
        }
        else {
            try {
                var res = await axios.put('http://localhost:8801/student/' + id, student)
                debugger
                //alert(res.data.message);
                navigate("/");
                fetchAllStudent();
                formclear();
                setaction('Submit');
                setidDisabled(false);
                if ('sqlMessage' in res.data) {
                    toast.success(res.data.sqlMessage);
                } else {
                    toast.success(res.data.message);
                }

            } catch (error) {
                alert(error.message)
            }
        }
    };
    const handleDelete = async (id) => {
        debugger
        try {
            const res = await axios.delete("http://localhost:8801/student/" + id);
            debugger
            //alert(res.data.message)
            navigate("/")
            toast.success(res.data.message);
            fetchAllStudent();
        } catch (err) {
            console.log(err);
        }
    };

    const multideleteData = async (e) => {
        debugger
        const  sids = {ids:selectDeleteData.toString()}
        try {
            const res = await axios.post("http://localhost:8801/studentdelete",sids);
            debugger
            //alert(res.data.message)
            navigate("/")
            toast.success(res.data.message);
            setSelectDeleteData([]);
            fetchAllStudent();
        } catch (err) {
            console.log(err);
        }
    };


    const updateData = async (id) => {
        setidDisabled(true);
        setaction('Update');
        const fetchStudent = async () => {
            try {

                const res = await axios.get("http://localhost:8801/student/" + id);
                debugger;
                console.log(res);
                setid(res.data[0].id)
                setname(res.data[0].name);
                setgender(res.data[0].gender);
                setcollege(res.data[0].college);
                setsubject(res.data[0].subject.split(','));
                setstream(res.data[0].stream);

            } catch (err) {
                console.log(err);
            }
        }
        fetchStudent();
    }
    return (
        <>
            <Container>
                <ToastContainer />
                <h2>Student Form</h2>
                <Form id='Sform'>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Student ID:</Form.Label>
                                <Form.Control disabled={idDisabled} onChange={getid} type='text' name='id' value={id} placeholder='Enter Student ID'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>Student Name:</Form.Label>
                                <Form.Control onChange={getname} type='text' value={name} name='name' placeholder='Enter Student Name'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label >Gender:</Form.Label><br></br>
                                <Form.Check inline onChange={getgender} type='radio' name='Gender' checked={gender.includes('Male')} value='Male' label='Male' />
                                <Form.Check inline onChange={getgender} name='Gender' type='radio' checked={gender.includes('Female')} value='Female' label='Female' />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className=''>College Name:</Form.Label>
                                <Form.Control onChange={getcollege} type='text' name='College' value={college} placeholder='Enter Student College Name'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Form.Group>
                                <Form.Label >Subject:</Form.Label><br></br>
                                <Form.Check inline onChange={getsubject} checked={subject.includes('English')} name="subject" value='English' type='checkbox' label='English' />
                                <Form.Check inline onChange={getsubject} checked={subject.includes('Hindi')} name="subject" value='Hindi' type='checkbox' label='Hindi' />
                                <Form.Check inline onChange={getsubject} checked={subject.includes('Gujarati')} name="subject" Value='Gujarati' type='checkbox' label='Gujarati' />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group><Form.Label >Stream:</Form.Label>
                                <Form.Select onChange={GetStream} value={stream}>
                                    <option value=''>Select Stream</option>
                                    <option value='BCA'>BCA</option>
                                    <option value='MCA'>MCA</option>
                                    <option value='MCOM'>MCOM</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={() => handleSave()}>{action}</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Container>
                <Form id='tblForm'>

               
                <Table striped border={2} hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name </th>
                            <th>Gender : </th>
                            <th>College Name : </th>
                            <th>Subject : </th>
                            <th>Stream : </th>
                            <th>Action</th>
                            <th>{selectDeleteData.length>0 ? <Button disabled={deleteDisabled} onClick={multideleteData}>Delete</Button>: ''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item) =>
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.gender}</td>
                                <td>{item.college}</td>
                                <td>{item.subject}</td>
                                <td>{item.stream}</td>
                                <td><Button value={item.id} onClick={() => viewStudent(item.id)} >View</Button></td>
                                <td><Button value={item.id} onClick={() => updateData(item.id)} >Edit</Button></td>
                                <td><Button value={item.id} onClick={() => handleDelete(item.id)}>Delete</Button></td>
                                <td><Form.Check value={item.id} onChange={GetDeleteData}   checked={selectDeleteData.includes(item.id)} name="multipleSeclect" type={'checkbox'}/></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </Form>
            </Container>
            <Container>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Student Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            Id : {viewdata.map((item) => item.id)}
                        </Row>
                        <Row>
                            Name : {viewdata.map((item) => item.name)}
                        </Row>
                        <Row>
                            Gender : {viewdata.map((item) => item.gender)}
                        </Row>
                        <Row>
                            College : {viewdata.map((item) => item.college)}
                        </Row>
                        <Row>
                            Subject : {viewdata.map((item) => item.subject)}
                        </Row>
                        <Row>
                            Stream : {viewdata.map((item) => item.stream)}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    )
}
export default StudentList;