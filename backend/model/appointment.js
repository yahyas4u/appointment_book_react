var mongoose = require('mongoose');
var Schema = mongoose.Schema;

appointmentSchema = new Schema( {
    slot_id:Schema.{type : ObjectId, require:true},
	service_id:Schema.ObjectId,
	service_name:String,
    appointment_date:String,
    status:{ type: Boolean, default: false },
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
appointment = mongoose.model('appointment', appointmentSchema);

module.exports = appointment;