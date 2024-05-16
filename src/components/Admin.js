import React, { useEffect, useState } from "react";
// import { useAuth } from "../hooks/AuthProvider";
import axios from 'axios';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


function Admin() {

    const[id,setid]=useState('');
    const [category, setcategory] = useState('');
    const [allcategory, setallcategory] = useState([]);
    const [allProduct, setallProduct] = useState([]);
    const [product, setproduct] = useState('');
    const [stock,setstock] = useState('');
    const [price, setprice] = useState('');
    const navigate = useNavigate();
    // const location = useLocation();
    const [action, setaction] = useState('Save')

    useEffect(() => {
        fetchCategory();
        // fetchProduct();
    },[])
    const fetchCategory = async () => {
        try {
            debugger
            // const res = await axios.get("http://localhost:8801/category");
            const res = await axios.get("https://web-backend-api-575c4fb7fce0.herokuapp.com/category");
            // console.log(res);
            setallcategory(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    const fetchProduct = async () => {
        try {
            const res = await axios.get("http://localhost:8801/product");
            debugger
            // console.log(res);
            setallProduct(res.data);

            // allcategory.map((item) => {
            //     if (allProduct.category_id === item.category_id) {
            //         // setallProduct(...allProduct,category_name = item.category_name)
            //     }
            // })

        } catch (err) {
            console.log(err);
        }
    }
    const Addcategory = async () => {
        var categorydata = {
            category_name: category
        }
        try {
            var res = await axios.post('http://localhost:8801/category', categorydata)
            alert(res.data.message)
            navigate("/admin");
            fetchCategory();
            setcategory('');
        } catch (error) {
            alert(error.message)
        }
    }
    const DeleteCategory = async (id) => {
        try {
            const res = await axios.delete("http://localhost:8801/category/" + id);
            alert(res.data.message)
            navigate("/admin")
            // toast.success(res.data.message);
            fetchCategory();
            fetchProduct();
        } catch (err) {
            console.log(err);
        }
    }
    const Addproduct = async (e) => {
        var productdata = {
            category_id: category,
            product_name: product,
            product_price: price,
            product_stock:stock
        }
        if (productdata.category_id === '' ||
            productdata.product_name === '' ||
            productdata.product_price === '' ||
            productdata.product_stock === ''
        ) {
            alert("Enter All Valid Data");
        } else if (action === 'Save') {
            try {
                var res = await axios.post('http://localhost:8801/product', productdata)
                navigate("/admin");
                fetchCategory();
                fetchProduct();
                setproduct('');
                setprice('');
                setstock('');
                setcategory('');
            } catch (error) {
                alert(error.message)
            }
        }else{
            try {
                debugger
                res = await axios.put('http://localhost:8801/product/' + id, productdata)
                alert(res.data.message);
                navigate("/admin");
                fetchCategory();
                fetchProduct();
                setproduct('');
                setprice('');
                setstock('');
                setcategory('');
                setaction('Save');
            } catch (error) {
                alert(error.message)
            }
        }
        }
        const updateProduct = async (product_id) => {
            setaction('Update');
            const fetchProduct = async () => {
                try {
                    const res = await axios.get("http://localhost:8801/product/" + product_id);
                    debugger
                    setid(res.data[0].product_id);
                    setproduct(res.data[0].product_name);
                    setprice(res.data[0].product_price);
                    setstock(res.data[0].product_stock);
                    setcategory(res.data[0].category_id);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchProduct();
        }
        const DeleteProduct = async (id) => {
            try {
                const res = await axios.delete("http://localhost:8801/product/" + id);
                alert(res.data.message)
                navigate("/admin")
                // toast.success(res.data.message);
                fetchCategory();
            } catch (err) {
                console.log(err);
            }
        }
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <Form.Group>
                                <h2>Product Category Manage</h2>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Add Product Category Name :</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control type='text' onChange={(e) => setcategory(e.target.value)}></Form.Control>
                        </Col>
                        <Col>
                            <Button onClick={Addcategory}>Save</Button>

                        </Col>
                    </Row>
                    <br></br><hr></hr><br></br>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Product Category List</Form.Label>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allcategory.map((item) =>
                                            <tr>
                                                <td>{item.category_id}</td>
                                                <td>{item.category_name}</td>
                                                <td><Button variant="primary" value={item.category_id} onClick={() => DeleteCategory(item.category_id)}>Delete</Button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
                <hr></hr><hr></hr>
                <Container>
                    <Row>
                        <Col>
                            <Form.Group>
                                <h2>Product Manage</h2>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Select Product Category :</Form.Label>
                        </Col>
                        <Col>
                            <Form.Select onChange={(e) => setcategory(e.target.value)} value={category}>
                                <option value=''>Select Category</option>
                                {allcategory.map((item) =>
                                    <option value={item.category_id}>{item.category_name}</option>
                                )}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Product Name :</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control type="text" onChange={(e) => setproduct(e.target.value)} value={product}></Form.Control>
                        </Col>
                    </Row><br></br>
                    <Row>
                        <Col>
                            <Form.Label>Product Price :</Form.Label>
                        </Col>
                        <Col><Form.Control type="number" onChange={(e) => setprice(e.target.value)} value={price}></Form.Control></Col>Rs.
                        <Col inline>
                            <Form.Label>Product Stock :</Form.Label>
                        </Col>
                        <Col><Form.Control type="number" onChange={(e) => setstock(e.target.value)} value={stock}></Form.Control></Col>
                        <Col><Button onClick={() => Addproduct()}>{action}</Button></Col>
                    </Row>
                    <br></br><hr></hr><br></br>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Product List</Form.Label>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allProduct.map((item) =>
                                            <tr>
                                                <td>{item.product_id}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.category_name}</td>
                                                <td>{item.product_price}/-Rs.</td>
                                                <td>{item.product_stock}</td>
                                                <td><Button variant="primary" value={item.product_id} onClick={() => DeleteProduct(item.product_id)}>Delete</Button>  <Button variant="primary" value={item.product_id} onClick={() => updateProduct(item.product_id)}>Edit</Button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
    export default Admin;