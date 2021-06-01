const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomNameShowVariable = document.getElementById('roomNameShow');
const userList = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix : true});

const socket = io();

//join chat room
socket.emit('joinRoom', {
    username, room
})
socket.on('roomUser', ({
   roomNameSent, users
}) => {
    outputRoomName(roomNameSent);
    outputUsers(users);
})

socket.on('messageFromServer', msg => {
    console.log(msg);
    outputMessage(msg);
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    let msg = e.target.elements.msg.value.trim();
    if(!msg){
        return false
    }else {
        socket.emit('chatMessage', msg);
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    }
});

let outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.userName;
    console.log(message);
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.msgText;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

let outputRoomName = (roomNameGiven) => {
    roomNameShowVariable.innerHTML = String(roomNameGiven);
}

let outputUsers = (userListGiven) => {
    userList.innerHTML = '';
    userListGiven.forEach(user => {
        let li = document.createElement('li');
        li.innerHTML = user.userName;
        userList.appendChild(li);
    })
};

document.getElementById('leave-btn').addEventListener('click', function(e){
    if(confirm('Are you sure you would like to leave ?')){
        window.location.href = '/';
    }
});


