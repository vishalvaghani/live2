import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import axios from 'axios';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { DataGridPremium, GridToolbar } from '@mui/x-data-grid-premium';

// import { ToastContainer, toast } from 'react-toastify';

function Dashboard() {

    const columnsData = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'product_name', headerName: 'Product name', width: 130 },
        { field: 'category_name', headerName: 'Category', width: 130 },
        { field: 'product_qty', headerName: 'Qty', width: 90 },
        { field: 'product_price', headerName: 'Price', width: 90 },
        { field: 'discount_amount', headerName: 'Discount', width: 90 },
        { field: 'tax_amount', headerName: 'Tax', width: 90 },
        { field: 'purchase_total', headerName: 'Total', width: 90 }
    ];

    const auth = useAuth();
    const [category, setcategory] = useState('');
    const [allcategory, setallcategory] = useState([]);
    const [availableproduct, setavailableproduct] = useState([]);
    const [product, setproduct] = useState([]);
    const [productdata, setproductdata] = useState([]);
    const [discounttype, setdiscounttype] = useState('');
    const [Discount, setDiscount] = useState(0);
    const [DiscountAmount, setDiscountAmount] = useState(0);
    const [productqty, setproductqty] = useState(1);
    const [totalqty,settotalqty] = useState(0);
    const [taxtype, settaxtype] = useState('');
    const [totaltax, settotaltax] = useState(0);
    const [totalamount, settotalamount] = useState(0);
    const [action, setaction] = useState('Add Order');
    const [allorder, setallorder] = useState([]);
    // const [productprice, setproductprice] = useState(0);
    const navigate = useNavigate();
    // const [username, setusername] = useState(auth.user?.username);
    const [orderid, setorderid] = useState(0);
    var tempproduct = [];

    useEffect(() => {
        // var userid = parseInt(auth.user?.user_id);
        fetchCategory();
        fetchAllorder();
    },[])

    const [resobj, setResobj] = useState({
        productqty: 0,
        productprice: 0,
        discountamount: 0,
        taxamount: 0
    });
    const fetchCategory = async () => {
        try {
            const res = await axios.get("http://localhost:8801/category");
            // console.log(res);
            setallcategory(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    const fetchproduct = async (id) => {
        try {
            const res = await axios.get("http://localhost:8801/getproduct/" + id);
            console.log(res);
            setavailableproduct(res.data);
            tempproduct = res.data;
        } catch (err) {
            console.log(err);

        }
    };
    const updateproductqty = async (order) => {
        try {
            debugger
            var id = order.product_id;
            const res = await axios.put("http://localhost:8801/updateqty/" + id, order);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    function Getproduct(e) {
        setcategory(e.target.value);
        setavailableproduct([]);
        setproductdata([]);
        setproductqty('');
        setdiscounttype('');
        setDiscountAmount(0);
        setDiscount(0);
        settaxtype('');
        settotaltax(0);
        settotalamount(0);

        if (e.target.value === "") {
            setavailableproduct([]);
        } else {
            fetchproduct(e.target.value);
        }
    }
    function selectproduct(e) {
        var productResObj = resobj;
        setproduct(e.target.value);
        setproductdata(availableproduct.find(item => item.product_id === parseInt(e.target.value)));
        productResObj.productprice = parseInt(availableproduct.find(item => item.product_id === parseInt(e.target.value)).product_price);
        setResobj(prevItem => ({ ...prevItem, productprice: parseInt(availableproduct.find(item => item.product_id === parseInt(e.target.value)).product_price) }))
        totalamountcalculation(productResObj)
        setproductqty('');
        setdiscounttype('');
        setDiscountAmount(0);
        setDiscount(0);
        settaxtype('');
        settotaltax(0);
        // settotalamount(0);
    }
    function getproductqty(e) {
        if (e.target.value === '') {
            settotalamount(0);
            setDiscountAmount(0);
            setproductqty(e.target.value);
        } else {
            debugger
            if (action === 'Update') {
                if (parseInt(e.target.value) > totalqty) {
                    alert('enter valid qty');
                } else {
                    setdiscounttype('');
                    setDiscount(0);
                    setDiscountAmount(0);
                    settaxtype(0);
                    settotaltax(0);
                    var productResObj = resobj;
                    productResObj.productqty = parseInt(e.target.value);
                    setResobj(prevItem => ({ ...prevItem, productqty: parseInt(e.target.value) }));
                    totalamountcalculation(productResObj);
                    setproductqty(parseInt(e.target.value));
                }
            } else if (parseInt(productdata.product_stock) < parseInt(e.target.value)) {
                alert('enter valid qty');
            } else {
                setdiscounttype('');
                setDiscount(0);
                setDiscountAmount(0);
                settaxtype(0);
                settotaltax(0);
                productResObj = resobj;
                productResObj.productqty = parseInt(e.target.value);
                setResobj(prevItem => ({ ...prevItem, productqty: parseInt(e.target.value) }));
                totalamountcalculation(productResObj);
                settotalqty(productdata.product_stock)
                setproductqty(e.target.value);
            }
        }

    }
    function selectdiscount(e) {
        setDiscount(0);
        setDiscountAmount(0);
        setdiscounttype(e.target.value);
    }
    function DiscountCalculate(e) {

        if (e.target.value === 0) {
            setDiscountAmount(0);
            settotalamount(0);
        } else {
            setDiscount(e.target.value);
            var sub_total = parseInt(productqty) * parseInt(productdata.product_price);
            if (discounttype === '1') {
                setDiscountAmount(parseInt(e.target.value));
                var productResObj = resobj;
                productResObj.discountamount = parseInt(e.target.value);
                setResobj(prevItem => ({ ...prevItem, discountamount: parseInt(e.target.value) }));
                totalamountcalculation(productResObj);
            } else {
                if (e.target.value > 99) {
                    alert('Discount Not Grater then 99%');
                    setDiscount(0);
                    setDiscountAmount(0);

                    // resobj.discountamount=0;
                    // totalamountcalculation(resobj);
                } else {
                    setDiscountAmount((sub_total / 100) * parseInt(e.target.value));
                    productResObj = resobj;
                    productResObj.discountamount = parseInt((sub_total / 100) * parseInt(e.target.value));
                    setResobj(prevItem => ({ ...prevItem, discountamount: (sub_total / 100) * parseInt(e.target.value) }));
                    totalamountcalculation(productResObj);
                }
            }
        }
    }
    function selecttax(e) {
        settaxtype(e.target.value);
        var stotal = parseInt(productqty) * parseInt(productdata.product_price);
        if (e.target.value === '0') {
            settotaltax(0);
            var productResObj = resobj;
            productResObj.taxamount = 0;
            setResobj(prevItem => ({ ...prevItem, taxamount: 0 }));
            totalamountcalculation(productResObj);
        } else if (e.target.value === '1') {
            settotaltax((stotal / 100) * 5);
            productResObj = resobj;
            productResObj.taxamount = (stotal / 100) * 5;
            setResobj(prevItem => ({ ...prevItem, taxamount: (stotal / 100) * 5 }));
            totalamountcalculation(productResObj);
        } else if (e.target.value === '2') {
            settotaltax((stotal / 100) * 10);
            productResObj = resobj;
            productResObj.taxamount = (stotal / 100) * 10;
            setResobj(prevItem => ({ ...prevItem, taxamount: (stotal / 100) * 10 }));
            totalamountcalculation(productResObj);
        } else if (e.target.value === '3') {
            settotaltax((stotal / 100) * 18);
            productResObj = resobj;
            productResObj.taxamount = (stotal / 100) * 18;
            setResobj(prevItem => ({ ...prevItem, taxamount: (stotal / 100) * 18 }));
            totalamountcalculation(productResObj);
        }
    }
    function totalamountcalculation(obj) {
        var sub_total = parseInt(obj.productqty) * parseInt(obj.productprice);
        settotalamount(sub_total - obj.discountamount + obj.taxamount);
    }
    function formclear() {
        setResobj({
            productqty: 0,
            productprice: 0,
            discountamount: 0,
            taxamount: 0
        });
        setcategory([]);
        setavailableproduct([]);
        setproductdata([]);
        setproductqty(0);
        setdiscounttype('');
        setDiscountAmount(0);
        setDiscount(0);
        settaxtype('');
        settotaltax(0);
        settotalamount(0);
        setproductqty(0);
    }
    const fetchAllorder = async () => {
        try {
            const res = await axios.get("http://localhost:8801/order/" + parseInt(auth.user?.user_id));
            console.log(res);
            setallorder(res.data);
        } catch (err) {
            console.log(err);

        }
    };

    const handleSave = async (id) => {
        var order = {
            purchase_id : parseInt(orderid),
            user_id: parseInt(auth.user?.user_id),
            category_id: parseInt(category),
            product_id: parseInt(product),
            product_stock: parseInt(totalqty),
            product_qty: parseInt(productqty),
            product_price: parseInt(productdata.product_price),
            discount_id: parseInt(discounttype),
            discount: parseInt(Discount),
            discount_amount: parseInt(DiscountAmount),
            tax_id: parseInt(taxtype),
            tax_amount: parseInt(totaltax),
            purchase_total: parseInt(totalamount)
        };
        if (order.user_id === '' ||
            order.category_id === '' ||
            order.product_id === '' ||
            order.product_qty === '' ||
            order.product_price === '' ||
            order.discount_id === '' ||
            order.discount === '' ||
            order.discount_amount === '' ||
            order.tax_id === '' ||
            order.tax_amount === '' ||
            order.purchase_total === '' ||
            order.AvailableQty === ''
        ) {
            alert("Enter All Valid Data");
        } else if (action === 'Add Order') {
            try {
                debugger
                var res = await axios.post('http://localhost:8801/order', order)
                // await updateproductqty(order);
                navigate("/dashboard");
                fetchAllorder();
                formclear();
                if ('sqlMessage' in res.data) {
                    alert(res.data.sqlMessage);
                } else {
                    alert(res.data.message);
                }
            } catch (error) {
                alert(error.message)
            }
        }
        else {
            try {
                var res = await axios.post('http://localhost:8801/order', order)
                // await updateproductqty(order);
                navigate("/dashboard");
                fetchAllorder();
                setaction('Add Order');
                formclear();
                if ('sqlMessage' in res.data) {
                    alert(res.data.sqlMessage);
                } else {
                    alert(res.data.message);
                }
            } catch (error) {
                alert(error.message)
            }
            //     debugger
            //     res = await axios.put('http://localhost:8801/order/' + orderid, order)
            //     // await updateproductqty(order);
            //     alert(res.data.message);
            //     navigate("/dashboard");
            //     fetchAllorder();
            //     formclear();
            //     setaction('Add Order');
            //     if ('sqlMessage' in res.data) {
            //         alert(res.data.sqlMessage);
            //     } else {
            //         alert(res.data.message);
            //     }
            // } catch (error) {
            //     alert(error.message)
            // }
        }
    }
    const updateorder = async (id) => {
        debugger
        setaction('Update');
        const fetchorder = async () => {
            try {
                const res = await axios.get("http://localhost:8801/orderdetails/" + id);
                debugger
                setorderid(id);
                setcategory(res.data[0].category_id);
                await fetchproduct(parseInt(res.data[0].category_id));
                setproduct(res.data[0].product_id);
                setproductdata(tempproduct.find(item => item.product_id === res.data[0].product_id));
                setproductqty(res.data[0].product_qty);
                settotalqty(parseInt(res.data[0].product_qty)+parseInt(res.data[0].product_stock));
                setdiscounttype(res.data[0].discount_id);
                setDiscountAmount(res.data[0].discount_amount);
                setDiscount(res.data[0].discount);
                settaxtype(res.data[0].tax_id);
                settotaltax(res.data[0].tax_amount);
                updatetaxcalculation(res.data[0].tax_id);
                setResobj(prevItem => ({ ...prevItem, productqty: parseInt(res.data[0].product_qty) }));
                setResobj(prevItem => ({ ...prevItem, productprice: parseFloat(res.data[0].product_price) }));
                setResobj(prevItem => ({ ...prevItem, discountamount: parseFloat(res.data[0].discount_amount) }));
                setResobj(prevItem => ({ ...prevItem, taxamount: parseFloat(res.data[0].tax_amount) }));
                settotalamount(res.data[0].purchase_total);
            } catch (err) {
                console.log(err);
            }
        }
        fetchorder();
    }
    function updatetaxcalculation(e) {

    }
    const DeleteOrder = async (id,pid,qty,stock) => {
        debugger
        var order = {
            product_id: parseInt(pid),
            product_stock: parseInt(stock)+parseInt(qty),
            product_qty : 0
        };
        try {
            
            const res = await axios.delete("http://localhost:8801/order/" + id);
            alert(res.data.message)
            await updateproductqty(order);
            navigate("/dashboard")
            // toast.success(res.data.message);
            fetchAllorder();
        } catch (err) {
            console.log(err);
        }
    }

    const columns = ["id", "product_name", "category_name", "product_qty", "product_price", "discount_amount", "tax_amount", "purchase_total"];
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    // Function to handle sorting
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection((prevDirection) =>
                prevDirection === "asc" ? "desc" : "asc"
            );
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    // Helper function to filter the data based on the search term
    const filterData = (data) => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    // Sort the filtered data
    const sortedData = sortColumn
        ? filterData(allorder).sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        }) : filterData(allorder);
    // Get total number of pages
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    // Helper function to generate pagination buttons
    const generatePaginationButtons = () => {
        const visibleButtons = 5; // Number of visible buttons
        const totalButtons = Math.min(visibleButtons, totalPages);

        let startPage = Math.max(currentPage - Math.floor(totalButtons / 2), 1);
        const endPage = startPage + totalButtons - 1;

        if (endPage > totalPages) {
            startPage = Math.max(totalPages - totalButtons + 1, 1);
        }

        return Array.from(
            { length: totalButtons },
            (_, index) => startPage + index
        );
    };

    // Get current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Change items per page
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to the first page when changing items per page
    };
    return (
        <>
            <div className="container">
                <div>
                    <h1>Welcome! {auth.user?.username}</h1>
                    <button onClick={() => auth.logOut()} className="btn-submit">
                        logout
                    </button>
                </div>
                <Container>
                    <Row>
                        <Col>
                            <Form.Group>
                                <h2>Product Order</h2>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Form.Label>Category List :</Form.Label></Col>
                        <Col>
                            <Form.Select onChange={Getproduct} value={category}>
                                <option value=''>Select Category</option>
                                {allcategory.map((item) =>
                                    <option value={item.category_id}>{item.category_name}</option>
                                )}
                            </Form.Select>
                        </Col>
                        <Col><Form.Label>Product List :</Form.Label></Col>
                        <Col>
                            <Form.Select onChange={selectproduct} value={product}>
                                <option value=''>Select Product</option>
                                {availableproduct.map((item) =>
                                    <option value={item.product_id}>{item.product_name}</option>
                                )}
                            </Form.Select>
                        </Col>
                        <Col>Price :</Col>
                        <Col><span>{productdata.product_price}</span></Col>
                        <Col>Available Qty :</Col>
                        <Col><span>{productdata.product_stock}</span></Col>
                    </Row>
                    <br></br><br></br>
                    <Row>
                        <Col>
                            <Form.Label>Product Qty : </Form.Label>
                        </Col>
                        <Col><Form.Control type="number" onChange={getproductqty} value={productqty}></Form.Control></Col>
                        <Col>Select Discount Type :</Col>
                        <Col><Form.Select onChange={(e) => selectdiscount(e)} value={discounttype}>
                            <option value='0'>Select</option>
                            <option value='1'>Fixed</option>
                            <option value='2'>Percentage</option>
                        </Form.Select></Col>
                        <Col><Form.Control disabled={discounttype === '' ? true : false} onChange={(e) => DiscountCalculate(e)} value={Discount} type="number"></Form.Control></Col>
                        <Col>{discounttype === "0" ? 'Rs.' : '%'}</Col>
                        <Col></Col>
                        <Col>Discount Amount :</Col>
                        <Col>{DiscountAmount}</Col>
                    </Row>
                    <br></br><br></br>
                    <Row>
                        <Col>Select Tax :</Col>
                        <Col><Form.Select onChange={(e) => selecttax(e)} value={taxtype}>
                            <option value='0'>Select</option>
                            <option value='1'>5%</option>
                            <option value='2'>10%</option>
                            <option value='3'>18%</option>
                        </Form.Select></Col>
                        <Col>Tax Amount :</Col>
                        <Col>{totaltax}</Col>
                        <Col>Total Amount :</Col>
                        <Col>{totalamount}</Col>
                        <Col><Button variant="primary" onClick={() => handleSave()}>{action}</Button></Col>
                    </Row>
                </Container>
                <br></br><hr></hr>
                {/* <Container>
            <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label><h2>Order List</h2></Form.Label>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Order Id</th>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>DiscountAmount</th>
                                            <th>Tax Amount</th>
                                            <th>Total Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allorder.map((item) =>
                                            <tr>
                                                <td>{item.purchase_id}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.category_name}</td>
                                                <td>{item.product_qty}</td>
                                                <td>{item.product_price}</td>
                                                <td>{item.discount_amount}</td>
                                                <td>{item.tax_amount}</td>
                                                <td>{item.purchase_total}</td>
                                                <td><Button variant="primary" value={item.purchase_id} onClick={() => DeleteProduct(item.purchase_id)}>Delete</Button>  <Button variant="primary" value={item.purchase_id} onClick={() => updateorder(item.purchase_id)}>Edit</Button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Form.Group>
                        </Col>
                    </Row>
            </Container> */}
            </div>
            <br></br><br></br>
            <Container>
                <h2>Order List</h2>
                <span>Search : <input type="text" className="search-input" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></span>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} onClick={() => handleSort(column)}>
                                    {column}
                                    {sortColumn === column && (
                                        <span>
                                            {sortDirection === "asc" ? <>&uarr;</> : <>&darr;</>}
                                        </span>
                                    )}
                                </th>
                            ))}
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="data-cell">
                                        {row[column]}
                                    </td>
                                ))}
                                <td>
                                    <Button variant="primary" value={row.id} onClick={() => DeleteOrder(row.id,row.product_id,row.product_qty,row.product_stock)}>Delete</Button>  <Button variant="primary" value={row.id} onClick={() => updateorder(row.id)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-buttons">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-button"
                    >
                        Previous
                    </button>
                    {generatePaginationButtons().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                                fontWeight: page === currentPage ? "bold" : "normal",
                            }}
                            className="page-button" // Added className to button element
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-button" // Added className to button element
                    >
                        Next
                    </button>
                    <label>
                        Items per page:
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                handleItemsPerPageChange(parseInt(e.target.value))
                            }
                            className="items-per-page-select" // Added className to select element
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>
            </Container>
            <Container>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGridPremium
                        rows={allorder}
                        columns={columnsData}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        slots={{
                            toolbar: GridToolbar,
                        }}

                    />
                </div>
            </Container>
        </>
    );
};

export default Dashboard;