import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Slot extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openSlotModal:false,
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      page: 1,
      search: '',
      products: [],
      slots:[],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getSlot();
      });
    }
  }

  getSlot = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    //console.log(data);
    axios.get(`http://localhost:2000/slot/get-slot${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, slots: res.data.slots, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        //type: "error"
      });
      this.setState({ loading: false, slots: [], pages: 0 },()=>{});
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSlot();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getSlot();
      });
    }
  };

  addSlot = () => {
    //const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('from', this.state.from);
    file.append('to', this.state.to);
    
    axios.post('http://localhost:2000/add-slot', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        //type: "success"
      });

      this.handleSlotClose();
      this.setState({ from: '', to: '', page: 1 }, () => {
        this.getSlot();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        //type: "error"
      });
      this.handleSlotClose();
    });

  }

  handleSlotOpen = (data) => {
    this.setState({
      openSlotModal: true,
      id: data._id,
      from: '',
      to: ''
    });
  };

  handleSlotClose = () => {
    this.setState({ openSlotModal: false });
  };
  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Slots
          </Button>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Services
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Product */}
        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              required
            /><br /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.desc === '' || this.state.discount === '' || this.state.price === ''}
              onClick={(e) => this.updateProduct()} color="primary" autoFocus>
              Edit Product
            </Button>
          </DialogActions>
        </Dialog>
    

    {/*Add Slot*/}

        <Dialog
          open={this.state.openSlotModal}
          onClose={this.handleSlotClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Slot</DialogTitle>
          <DialogContent>
          <TextField
              type="date"
              autoComplete="off"
              name="from"
              value={this.state.from}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              type="date"
              autoComplete="off"
              name="to"
              value={this.state.to}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
          <br /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSlotClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.from === '' || this.state.to === ''}
              onClick={(e) => this.addSlot()} color="primary" autoFocus>
              Add Slot
            </Button>
          </DialogActions>
        </Dialog>

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by Service name"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Form</TableCell>
                <TableCell align="center">To</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.slots.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center" component="th" scope="row">
                    {row.service_name}
                  </TableCell>
                  <TableCell align="center">{row.from}</TableCell>
                  <TableCell align="center">{row.to}</TableCell>
                  <TableCell align="center">

                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleProductEditOpen(row)}
                    >
                      Edit
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>
      </div>
    );
  }
}