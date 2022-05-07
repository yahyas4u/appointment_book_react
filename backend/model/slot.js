var mongoose = require('mongoose');
var Schema = mongoose.Schema;

slotSchema = new Schema( {
	service_id:Schema.ObjectId,
	service_name:String,
    from: Date,
	to: Date,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
slot = mongoose.model('slot', slotSchema);

module.exports = slot;