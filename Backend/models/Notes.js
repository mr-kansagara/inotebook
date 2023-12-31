const mongoose = require("mongoose");
const { Schema } = mongoose;


const notesSchema = new Schema({
    title : {
        type: String,
        require : true
    },
    discription : {
        type: String,
        require : true,
        unique : true
    },
    tag : {
        type: String,
        default : "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('notes',notesSchema);
