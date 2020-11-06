const app = require(__dirname + '/index');

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("server is up and listening");
})