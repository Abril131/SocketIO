const application = require('express')();
const server = require('http').createServer(application)
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000 //300

let users = [];


application.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});


server.listen(PORT, () => {
   console.log('Servidor ejecutando en puerto: ' + PORT);
});

io.on('connection', (socket) => {
   socket.on('disconnect', () => {
       console.log('Usuario desconectado - Usuario: ' + socket.username);
   });

   socket.on('new message', (msg) => {
       io.emit('send message', {message: msg, user: socket.username});
       
   });

   socket.on('new message private', (private) =>{
     let temp;
     users.forEach(function(user){
        if(user.socket == socket) {temp = socket.id }
     })
     io.to(temp).emit('send message private', {message: private, id: socket.id});
   });

   socket.on('new image',(msgi)=>{
     io.emit('send image', {message: msgi, user: socket.username, file: msgi.file})
   })

   
   socket.on('new user', (usr) => {
                socket.username = usr;
                if(users.includes(usr) != true){
                  console.log('Usuario conectado - Usuario: ' + socket.username);
                 io.emit('send user', {user: socket.username})
                  users.push(socket.username)
                }else{
                  console.log('Usuario existente');
                }   
           
   });
});