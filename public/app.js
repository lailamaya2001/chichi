// This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount=0;
let likeCount= 0;
let diamondsCount=0;
let like_html = '';
let user_follows = [];
let user_likes = [];
let count_results = [];

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

$(document).ready(()=>{
    let fctt_username = localStorage.getItem('fctt_username');
    if(fctt_username){
        $('#uniqueIdInput').val(fctt_username);
    }
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup',function(e){
        if(e.key==='Enter'){
            connect();
        }
    });
})

function connect() {
    let uniqueId=$('#uniqueIdInput').val();
    if(uniqueId!==''){
        $('#connectButton').text('Connecting...');
        connection.connect(uniqueId,{enableExtendedGiftInfo:true}).then(state=>{
            console.log(`Connected to roomId ${state.roomId}`);
            let id = state.roomId;
            let room_id = uniqueId;
            showMessage('Đã kết nối phòng: <b>' + room_id +'</b>');
            $("#room_id").val(room_id);
            $('#connectButton').text('Connect');
            $(".box-button").removeClass('hide');
            $("#resetButton").removeClass('hide');
            localStorage.setItem('fctt_username', uniqueId);
            localStorage.setItem(room_id, JSON.stringify({id, viewerCount: 0, likeCount: 0, diamondsCount: 0, user_follows: [], user_likes: [],count_results:[],}));
        }).catch(errorMessage=>{
            $('#connectButton').text('Connect');
            // showError("Tài khoản "+ uniqueId + " đang không phát Live");
            // console.log(errorMessage);
        })

    } else {
        showError("Vui lòng nhập Username!");
    }
}
function getNumberFormat(number) {
    if(!number)
        return 0;
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text.replace(/</g, '&lt;')
}

function updateRoomStats(){
    $('#view_total').html(viewerCount.toLocaleString());
    $('#like_total').html(likeCount.toLocaleString())
    $('#diamond_total').html(diamondsCount.toLocaleString());
}
function generateUsernameLink(data) {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function addChatItem(color, data, text, summarize) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.chatcontainer');

    if (container.find('div').length > 500) {
        container.find('div').slice(0, 200).remove();
    }
    let total_count = 0;
    var get_ans =  document.getElementById("get_answer").value;
    var check_results =  document.getElementById("select-item-question").value;
    if (typeof check_results === 'string' ) {
        var uppercase = check_results.toLocaleUpperCase();
        var convert = parseInt(get_ans);
        if (convert == 1 && text === uppercase) {
           
            let room_id = $("#room_id").val();
            let room_data = localStorage.getItem(room_id);
            room_data = JSON.parse(room_data);
            if(room_data){
                count_results = room_data.count_results;
            }
            let userId = data.userId; 
            total_count++;
              let index = count_results.findIndex(object => {
                  return object.userId === userId;
              });
              if(index == -1) {
                count_results.push({userId, name: data.nickname, avatar: data.profilePictureUrl,correct: total_count});
              }
              else{
                  let select_item = count_results[index].correct;
                  select_item += 1;
                  count_results[index].correct = select_item;
              }
              localStorage.setItem(room_id, JSON.stringify(room_data));
            //   showResult(count_results)
            //   selectTop_mini(count_results)
            }
    }

    container.find('.temporary').remove();;

    container.append(`
        <div class=${summarize ? 'temporary' : 'static'}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
            <b>${generateUsernameLink(data.uniqueId)}:</b> 
                <span style="color:${color}">${sanitize(text)}</span>
            </span>
        </div>
    `);

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 400);
}

/**
 * Add a new gift to the gift container
 */
function addGiftItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');

    if (container.find('div').length > 200) {
        container.find('div').slice(0, 100).remove();
    }

    let streakId = data.userId.toString() + '_' + data.giftId;

    let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${data.describe}</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${data.giftPictureUrl}"></td>
                            <td>
                                <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
                                <span>Repeat: <b style="${isPendingStreak(data) ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(data.diamondCount * data.repeatCount).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `;

    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.append(html);
    }

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 800);
}


// viewer stats
connection.on('roomUser', (msg) => {
    if (typeof msg.viewerCount === 'number') {
        viewerCount = msg.viewerCount;
        updateRoomStats();
    }
})

// like stats
connection.on('like', (msg) => {
    if (typeof msg.totalLikeCount === 'number') {
        likeCount = msg.totalLikeCount;
        updateRoomStats();
    }

    if (window.settings.showLikes === "0") return;

    if (typeof msg.likeCount === 'number') {
        addChatItem('#447dd4', msg, msg.label.replace('{0:user}', '').replace('likes', `${msg.likeCount} likes`))
    }
})

// Member join
let joinMsgDelay = 0;
connection.on('member', (msg) => {
    if (window.settings.showJoins === "0") return;

    let addDelay = 250;
    if (joinMsgDelay > 500) addDelay = 100;
    if (joinMsgDelay > 1000) addDelay = 0;

    joinMsgDelay += addDelay;

    setTimeout(() => {
        joinMsgDelay -= addDelay;
        addChatItem('#21b2c2', msg, 'joined', true);
    }, joinMsgDelay);
})

// New chat comment received
connection.on('chat', (msg) => {
    if (window.settings.showChats === "0") return;

    addChatItem('', msg, msg.comment);
    // checkGames(msg,msg.comment)
})

// New gift received
connection.on('gift', (data) => {
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        diamondsCount += (data.diamondCount * data.repeatCount);
        updateRoomStats();
    }

    if (window.settings.showGifts === "0") return;

    addGiftItem(data);
})

// share, follow
connection.on('social', (data) => {
    if (window.settings.showFollows === "0") return;

    let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
    addChatItem(color, data, data.label.replace('{0:user}', ''));
})

connection.on('streamEnd', () => {
    $('#stateText').text('Stream ended.');

    // schedule next try if obs username set
    if (window.settings.username) {
        setTimeout(() => {
            connect(window.settings.username);
        }, 30000);
    }
})
$(document).on('change', '#select_top', function(e) {
    let value = $(this).val();
    if(value == 10){
        $(".top10").removeClass('hide');
    }
    else{
        $(".top10").addClass('hide');
    }
});
$(document).on('click', '#resetButton', function(e) {
    let room_id = $("#room_id").val();
    let room_data = localStorage.getItem(room_id);
    room_data = JSON.parse(room_data);
    if(room_data) {
        room_data.user_likes = [];
        localStorage.setItem(room_id, JSON.stringify(room_data));
    }
    else{
        localStorage.clear();
    }
    $(".box-duel").html('');
});
$(document).on('click', '#stopButton', function(e) {
    let value = $(this).attr('rel');
    value = (value == 0) ? 1 : 0;
    $(this).attr('rel', value);
    let time = $("#countdown_value").val();
    let date = new Date();
    let hour_current = date.getHours();
    let minute_current = date.getMinutes();
    let second_current = date.getSeconds();
    let time_data = time.split(':');
    hour_current += parseInt(time_data[0]);
    minute_current += parseInt(time_data[1]);
    second_current += parseInt(time_data[2]);

    let day = date.getDate();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    var countdown_time = year +'/'+ month +'/'+ day +' ' + hour_current + ':'+ minute_current +':'+ second_current;

    $("#countdown_active").val(countdown_time);

    countDown();
    setInterval(countDown, 1000);

    let button_name = '<span class="glyphicon glyphicon-play"></span> Start';
    let button_class = 'btn-success';
    let button_class_remove = 'btn-danger';
    if(value == 1){
        button_class = 'btn-danger';
        button_class_remove = 'btn-success';
        button_name = '<span class="glyphicon glyphicon-stop"></span> Stop';
    }
    else{
        $("#countdown_active").val(0);
    }
    $(this).addClass(button_class);
    $(this).removeClass(button_class_remove);
    $(this).html(button_name);
});

function addLikeItem(msg){
    let status = $("#stopButton").attr('rel');
    // console.log("= USER LIKE");
    // console.log(msg);
    if(status == 1){
        let room_id = $("#room_id").val();
        let room_data = localStorage.getItem(room_id);
        room_data = JSON.parse(room_data);
        if(room_data){
            user_likes = room_data.user_likes;
        }
        let userId = msg.userId;
        let likes = msg.likeCount;
        let index = user_likes.findIndex(object => {
            return object.userId === userId;
        });
        if(index == -1) {
            user_likes.push({userId, name: msg.nickname, likes, avatar: msg.profilePictureUrl});
        }
        else{
            let like_counter = user_likes[index].likes;
            like_counter += likes;
            user_likes[index].likes = like_counter;
        }

        // Sắp xếp
        user_likes = user_likes.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));

        room_data.user_likes = user_likes;
        localStorage.setItem(room_id, JSON.stringify(room_data));

        showLikesChart(user_likes);
    }
}
function removeData(room_id){
  
    var storedNames = JSON.parse(localStorage.getItem(room_id));
    storedNames.slice(6, 1); 
    localStorage.setItem(room_id, JSON.stringify(storedNames));
    localStorage.removeItem("fchat_titok_game");
}

function checkGames(msg, text) {
    let total_count = 0;
    var get_ans =  document.getElementById("get_answer").value;
    var check_results =  document.getElementById("select-item-question").value;
    if (typeof check_results === 'string' ) {
        var uppercase = check_results.toLocaleUpperCase();
        var convert = parseInt(get_ans);
        if (convert == 1 && text === uppercase) {
           
            let room_id = $("#room_id").val();
            let room_data = localStorage.getItem(room_id);
            room_data = JSON.parse(room_data);
            if(room_data){
                count_results = room_data.count_results;
            }
            let userId = msg.userId; 
            total_count++;
              let index = count_results.findIndex(object => {
                  return object.userId === userId;
              });
              if(index == -1) {
                count_results.push({userId, name: msg.nickname, avatar: msg.profilePictureUrl,correct: total_count});
              }
              else{
                  let select_item = count_results[index].correct;
                  select_item += 1;
                  count_results[index].correct = select_item;
              }
              localStorage.setItem(room_id, JSON.stringify(room_data));
            //   showResult(count_results)
            //   selectTop_mini(count_results)
            }
    }
  }