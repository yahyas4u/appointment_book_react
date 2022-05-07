const router = require('express').Router();
var slot = require("../model/slot");
var appointment = require("../model/appointment");
var express = require("express");
var app = express();
var cors = require('cors');
router.use(cors());
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
  var dir = './uploads';
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
  }));

router.route("/get-appointment").get((req, res) => {
    try {
      
      var perPage = 5;
      var page = req.query.page || 1;
      slot.find()
        .skip((perPage * page) - perPage).limit(perPage)
        .then((data) => {
              const count=data.length
              if (data && data.length > 0) {
                
                res.status(200).json({
                  
                  status: true,
                  title: 'Slot List',
                  slots: data,
                  current_page: page,
                  total: count,
                  pages: Math.ceil(count / perPage),
                });
              } else {
                res.status(400).json({
                  errorMessage: 'There is no Slots!',
                  status: false
                });
              }
  
        }).catch(err => {
          res.status(400).json({
            errorMessage: err.message || err,
            status: false
          });
        });
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  
  });

  /* Api to add Slot */
  router.route("/add-appointment").post(async(req, res) => {
    try {
        console.log(req);
        let new_appointment = new appointment();
       // new_appointment.slot_id = "123";
        //new_appointment.service_id = "131";
        new_appointment.service_name = req.body.service_name;
        new_appointment.appointment_date = req.body.date;
        await new_appointment.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Appointment Added successfully.'
            });
          }
        });
  
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  });
  module.exports = router;