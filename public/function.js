function getPhoneFormat(phone) {
    if (phone) {
      phone = phone.replace("(+84)", "0");
      phone = phone.replace("+84", "0");
      phone = phone.replace(/ /g, "");
  
      // lấy đầu số cũ
      var mobile_prefix_old = phone.slice(0, 4);
      if (mobile_prefix_old == "0162") {
        phone = "032" + phone.slice(4);
      } else if (mobile_prefix_old == "0163") {
        phone = "033" + phone.slice(4);
      } else if (mobile_prefix_old == "0164") {
        phone = "034" + phone.slice(4);
      } else if (mobile_prefix_old == "0165") {
        phone = "035" + phone.slice(4);
      } else if (mobile_prefix_old == "0166") {
        phone = "036" + phone.slice(4);
      } else if (mobile_prefix_old == "0167") {
        phone = "037" + phone.slice(4);
      } else if (mobile_prefix_old == "0168") {
        phone = "038" + phone.slice(4);
      } else if (mobile_prefix_old == "0169") {
        phone = "039" + phone.slice(4);
      } else if (mobile_prefix_old == "0120") {
        phone = "070" + phone.slice(4);
      } else if (mobile_prefix_old == "0121") {
        phone = "079" + phone.slice(4);
      } else if (mobile_prefix_old == "0122") {
        phone = "077" + phone.slice(4);
      } else if (mobile_prefix_old == "0126") {
        phone = "076" + phone.slice(4);
      } else if (mobile_prefix_old == "0128") {
        phone = "078" + phone.slice(4);
      } else if (mobile_prefix_old == "0123") {
        phone = "083" + phone.slice(4);
      } else if (mobile_prefix_old == "0124") {
        phone = "084" + phone.slice(4);
      } else if (mobile_prefix_old == "0125") {
        phone = "085" + phone.slice(4);
      } else if (mobile_prefix_old == "0127") {
        phone = "081" + phone.slice(4);
      } else if (mobile_prefix_old == "0129") {
        phone = "082" + phone.slice(4);
      }
    }
    return phone;
  }
  function checkPhone(phone) {
    var flag = "";
    if (phone) {
      phone = getPhoneFormat(phone);
      if (phone != "") {
        var firstNumber = phone.substring(0, 1);
        if (firstNumber == "0" || firstNumber == "+") {
          if (phone.match(/^\d{10}/) || firstNumber == "+") {
            flag = phone;
          }
        } else if (firstNumber == "01" && phone.length == 11) {
          if (phone.match(/^\d{11}/)) {
            flag = phone;
          }
        }
      }
    }
    let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (vnf_regex.test(phone) == false) {
      flag = "";
    }
    return flag;
  }
  function showMessage(msg) {
    $("#display_show").html(msg);
  }
  function showError(msg) {
    $("#error_show").html(msg);
  }
  function hideError() {
    $("#error_show").html("");
  }
  function generateUsernameLink(id) {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${id}" target="_blank">${id}</a>`;
  }
  function getLink(id) {
    return "https://www.tiktok.com/@" + id;
  }
  function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (typeof haystack[i] == "object") {
        if (arrayCompare(haystack[i], needle)) return true;
      } else {
        if (haystack[i] == needle) return true;
      }
    }
    return false;
  }
  function arrayCompare(a1, a2) {
    if (a1.length != a2.length) return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
      if (a1[i] !== a2[i]) return false;
    }
    return true;
  }
  function getPhone(phone) {
    if (phone) {
      let _text = phone.replace(/\.|\s|,|\-/g, "");
      let p = new RegExp(/([0|\+[0-9]{1,5})[0-9]{8}/);
      let check_phone = p.exec(_text);
      if (check_phone && check_phone[0]) {
        return check_phone[0];
      }
      return false;
    }
  }
  function countDown() {
    var now = moment();
    // countdown_time = "2022/6/7 14:45:35";
    let countdown_time = $("#countdown_active").val();
    var future = moment(countdown_time);
    var _widget = document.getElementById("timer-widget-" + 2555);
    var hours_elem = _widget
      .getElementsByClassName("hours")[0]
      .getElementsByTagName("span")[0];
    var minutes_elem = _widget
      .getElementsByClassName("minutes")[0]
      .getElementsByTagName("span")[0];
    var seconds_elem = _widget
      .getElementsByClassName("seconds")[0]
      .getElementsByTagName("span")[0];  
    if (Number.isInteger(future)) {
      var delta = Math.abs(future - now) / 1000;
    } else {
      var now = new Date().getTime();
      var future = new Date(countdown_time).getTime();
      var delta = Math.abs(future - now) / 1000;
    }
  
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    let check_time = future - now;
    if (check_time <= 0) {
      $("#stopButton").attr("rel", 0);
      $("#stopButton").html(
        '<span class="glyphicon glyphicon-play"></span> Start'
      );
      $("#stopButton").removeClass("btn-danger");
      $("#stopButton").addClass("btn-success");
      clearInterval(countDown);
    } else {
      hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      seconds = Math.floor(delta % 60);
    }
    hours_elem.innerHTML = formatDigits(hours, 2);
    minutes_elem.innerHTML = formatDigits(minutes, 2);
    seconds_elem.innerHTML = formatDigits(seconds, 2);
  }
  function showfollows(user_phones) {
    let container = $(".phone_container");
    let user_phone_html = "";
    for (let i = 0; i < user_phones.length; i++) {
      let data = user_phones[i].data;
      let text = user_phones[i].text;
      user_phone_html +=
        '<div class="static">' +
        '<img class="miniprofilepicture" src="' +
        data.profilePictureUrl +
        '"> ' +
        '<span><a href="' +
        getLink(data.userId) +
        '"><b>' +
        data.nickname +
        "</b></a> " +
        "<span>" +
        sanitize(text) +
        "</span></span>" +
        "</div>";
    }
    container.find(".phone_container_show").html(user_phone_html);
  }
  function compare( a, b ) {
    if ( a.correct < b.correct ){
      return 1;
    }
    if ( a.correct > b.correct ){
      return -1;
    }
    return 0;
  }
  function selectTop_mini(count_results){
    count_results.sort(compare);
    document.getElementById("img").src = count_results[0].avatar;
  
  }
  function showLikesChart(user_likes) {
    let select_top = parseInt($("#select_top").val());
    select_top -= 1;
    let totalLikeCount = user_likes[0].likes;
    like_html = "";
    let user_show = [];
    for (let i = 0; i < user_likes.length; i++) {
      if (i >= 10) {
        break;
      }
      let user_id = user_likes[i].userId;
      user_show.push(user_id);
      let class_set = "top10";
      if (i < 5) {
        class_set = "top5";
      } else {
        if (select_top == 4) {
          class_set += " hide";
        }
      }
      let likes = user_likes[i].likes;
      let rate = (likes / totalLikeCount) * 100;
      // console.log(likes);
      // console.log(totalLikeCount);
      // console.log("_______________");
      like_html +=
        '<div class="duel-item ' +
        class_set +
        '"><div class="progress-bar-duel"><div class="duel-name">' +
        '<a href="' +
        getLink(user_likes[i].userId) +
        '" target="_blank"><div class="duel-name-user" title="' +
        user_likes[i].name +
        '">' +
        user_likes[i].name +
        "</div> " +
        '<img class="miniprofilepicture" src="' +
        user_likes[i].avatar +
        '"></a></div>' +
        '<div class="progress-bar-duel-line" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' +
        rate +
        '%"></div> ' +
        '<div class="duel-number">' +
        getNumberFormat(likes) +
        "</div></div></div>";
    }
    $(".box-duel").html(like_html);
  }
  function reset() {
    hideError();
    $("#display_show").html("");
    $("#view_total").html(0);
    $("#like_total").html(0);
    $("#diamond_total").html(0);
    $("#phone_total").html(0);
    $(".chatcontainer").html('<h3 class="containerheader">Chats</h3>');
    $(".giftcontainer").html('<h3 class="containerheader">Gifts</h3>');
    $(".phone_container_show").html("");
    localStorage.clear();
  }
  
  let count = "";
  let tmp = "";
  let tmp1 = "";
  let count_success = 0;
  let count_correct = 0;
  typingInput = document.querySelector(".typing-input");
  
  const inputs = document.querySelector(".suggest");
  let timeout_result = '';
  
  
  function showQuestion( ) {
    var x = document.getElementById("myInput").value;
    var index = parseInt(x);
    let check = JSON.parse(localStorage.getItem("fchat_titok_game"));
    let data = check[index];  
    if (data) {
      document.getElementById("key").innerHTML = data.question;
      document.getElementById("img").src = data.image;
  
      var res = data?.answer;
      var sug = data?.suggest;
      let html = "";
  
      var sli1 = sug?.trim();
  
      const myArray_sug = sli1?.split("");
  
      var sli2 = res?.trim();
  
      const myArray_ans = sli2?.split("");
  
      for (let i = 0; i < myArray_sug?.length; i++) {
        html += '<p   class="fchat_result_item">' + myArray_sug[i] + "</p>";
        inputs.innerHTML = html;
      }
  
      var cut = myArray_ans?.slice(0, myArray_sug?.length);
  
      var hidden_leng = myArray_ans?.length - cut?.length;
  
      tmp = myArray_ans?.slice(hidden_leng - 1);
  
      for (let j = 0; j < hidden_leng; j++) {
        html += '<p   class="fchat_result_item result">?</p>';
        inputs.innerHTML = html;
      }
    }
  }
  
    function startTimer(durations, display) {
        let timer = durations,
        minutes,
        seconds;
        var check1 = JSON.parse(localStorage.getItem("fchat_titok_game"));
        var len = check1.length;
        var downloadTimer = setInterval(function () {
        var x = document.getElementById("myInput").value;
        var index = parseInt(x);
        var res = check1[index]?.answer;
        var sug = check1[index]?.suggest;
        var sli1 = sug?.trim();
        const myArray_sug1 = sli1?.split(""); 
        var sli2 = res?.trim();
        const myArray_ans1 = sli2?.split("");
        var cut = myArray_ans1?.slice(0, myArray_sug1.length);
        var hidden_leng = myArray_ans1?.length - cut?.length;
        var number_l = cut?.length;
        tmp1 = myArray_ans1?.slice(number_l);
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById("select-item-question").value = check1[index]?.answer;
        display.textContent = minutes + ":" + seconds;
        if (index < len) {
        
          if (timer < 1) {
            document.getElementById("get_answer").value = 0;
            for (let k = 0; k < tmp1.length; k++) {
              timeout_result = document.getElementsByClassName("result")[k];
              timeout_result.innerHTML = tmp1[k];
            }
            display.textContent = "";
            var myTimeout1 = setTimeout(myGreeting, 2500);
            
            function myGreeting() {
              index++;
              document.getElementById("get_answer").value = 1;
              timer = check1[index]?.duration;
              document.getElementById("myInput").value = index;
              document.getElementById("select-item-question").value = check1[index]?.answer;
              showQuestion( );
            }
          }else{
            document.getElementById("get_answer").value = 1;
          }
        } else {
          alert("bạn đã hoàn thành trò chơi");
          var element = document.getElementById("user_win");
          element.classList.remove("user_win_hidden");
          element.classList.add("user_win_show");
          clearInterval(downloadTimer);
          clearTimeout(myTimeout1);
          
          display.textContent = "Kết thúc";
          //  setTimeout(finished, 2000);
          // function finished() {
          //   $(document).ready(function () {
          //     $("#result").modal("show");
          //     $("#controller").modal("hide");
          //   });
          // }
          
        }
       timer -=1;
      }, 1000);
    }
    
    function showResult(count_results) {
      count_results.sort(compare);
      result_html = "";
      for (let i = 0; i < count_results.length; i++) {
        let user_id = count_results[i].userId;
        var able = i++;
        let counts = count_results[i].correct;
        result_html += '<td  style="width: 50%;">' + able + '.' + user_id 
         '</td>'; 
        result_html += '<td  style="width: 50%;">' + 
        counts + '</td>'; 
           
      }
      $(".total_number").append(result_html);
    }  
  function reload_pages(){
    window.location.reload()
  }
   