const router = require('express').Router();
var slot = require("../model/slot");
var express = require("express");
var app = express();
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
  var dir = './uploads';
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
  }));

router.route("/get-slot").get((req, res) => {
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
  router.route("/add-slot").post(async(req, res) => {
    try {
      if (req.body &&  req.body.id && req.body.service_name && req.body.from && req.body.to) {

        let new_slot = new slot();
        new_slot.from = req.body.from;
        new_slot.to = req.body.to;
        new_slot.service_id = req.body.id;
        new_slot.service_name = req.body.service_name;
        await new_slot.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Slot Added successfully.'
            });
          }
        });
  
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  });
  module.exports = router;