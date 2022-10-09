import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, Link
} from '@material-ui/core';
import Moment from 'moment';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Appointment extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openSlotModal:false,
      openAppModal: false,
      openAppEditModal: false,
      id: '',
      data:'',
      name: '',
      desc: '',
      page: 1,
      search: '',
      products: [],
      appointments: [],
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
        this.getAppointments();
      });
    }
  }

  getAppointments = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
      data='?'
    }
    //console.log(data);
    axios.get(`http://localhost:2000/appointment/get-appointment-all${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, appointments: res.data.appointments, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        //type: "error"
      });
      this.setState({ loading: false, appointments: [], pages: 0 },()=>{});
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
        this.setState({ id: '',file: null }, () => {
            this.getAppointments();
          });
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
        this.getAppointments();
      });
    }
  };

  
  handleAppEditOpen = (data) => {
    this.setState({
      openAppEditModal: true,
      id: data._id,
      //status: data.status
    });
  };

  handleAppEditClose = () => {
    this.setState({ openAppEditModal: false });
  };

  approveApp = (data) => {
    axios.post('http://localhost:2000/appointment/update-approve', {
      data: data
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.getAppointments();
    });
  }

  deleteApp = (id) => {
    axios.post('http://localhost:2000/appointment/delete-approve', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.getAppointments();
    });
  }
 
  render() {
    Moment.locale('en');
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Appointment List</h2>
          <Link href="/slot">
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Slot
          </Button>
        </Link>
        <Link href="/dashboard"> 
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
          >
            Services
          </Button>
        </Link>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Approve Appointment */}
        <Dialog
          open={this.state.openAppEditModal}
          onClose={this.handleAppClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Approve</DialogTitle>
          <DialogContent>
            <TextField>aaaa</TextField><br />
           
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleAppEditClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={(e) => this.updateApprove()} color="primary" autoFocus>
              Approve
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
                <TableCell align="center">Service Name</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Appointment Date</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.appointments.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center" component="th" scope="row"> {row.service_name}</TableCell>
                  <TableCell align="center" component="th" scope="row"> {row.username}</TableCell>
                  <TableCell align="center">{Moment(row.appointment_date).format('DD-MM-YYYY')}</TableCell>
                 
                  <TableCell align="center">{(row.status===true)? "Approved" : "Pending"}</TableCell>
                  <TableCell align="center">

                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.approveApp(row)}
                    >
                      {(row.status===true)? "Unapprove" : "Approve"}
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteApp(row._id)}
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