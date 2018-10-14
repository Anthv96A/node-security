const mongoose = require('mongoose');
mongoose.connect('mongodb://bg71ul:test123@ds145275.mlab.com:45275/cet324').then(() => {
    console.log("Connected!!")
}).catch(() => {
    console.log('Unable to connect :(');
})

//Anth
//6soWTqXI1hErGDXK