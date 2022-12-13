let active_user = document.getElementById("acctive_user")
let deacctive_user = document.getElementById("deacctive_user")
let profile_div = document.getElementById("profile_div")
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);


if(localStorage.getItem("access")){
    private_profile()
    active_user.style = "display:block;"
    deacctive_user.style = "display:none;"
    profile_div.style = "display:block;padding:14px 30px 0px 30px; display: flex; align-items: center;"
    
} else {
    active_user.style = "display:none;"
    deacctive_user.style= "display:block;"
    profile_div.style = "display:none"
}





// 알람 
console.log(payload_parse.user_id)
const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    + payload_parse.user_id
    + '/'
);

notificationSocket.onmessage = async function (e) {
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')


        const alarmContent = document.createElement('div')
        alarmContent.style.display = "flex"
        alarmContent.style.height = "10vh"
        alarmContent.innerHTML = data.message
        alarmBox.appendChild(alarmContent)


    const response = await fetch(`http://127.0.0.1:8000/notification/${payload_parse.user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    const notificationButton = document.createElement('button')
    const notificationButtonText = document.createTextNode('확인')
    notificationButton.appendChild(notificationButtonText)
    notificationButton.onclick = async function () {
        await fetch(`http://127.0.0.1:8000/notification/alarm/${response[0].id}/`, {
            headers: {
                'content-type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: ''
        })
        alarmBox.innerHTML = ""
        getNotification()
    }
    alarmContent.appendChild(notificationButton)

    alarmBox.appendChild(alarmContent)
};

notificationSocket.onclose = function (e) {
    console.error('소켓이 닫혔어요 ㅜㅜ');
};





//개인 프로필
async function private_profile(){
    
    const response = await fetch(`${backendBaseUrl}/users/profiles/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)
    const h6_profile_nickname = document.getElementById("profile_nickname")
    const h6_profile_username = document.getElementById("profile_username")
    const h6_profile_email = document.getElementById("profile_email")

    h6_profile_nickname.innerText = `닉네임: ${response_json.nickname}`
    h6_profile_username.innerText = `아이디: ${response_json.username}`
    h6_profile_email.innerText = `이메일: ${response_json.email}`
    document.getElementById("porfile-img").src = `${backendBaseUrl}${response_json.profile_image}`
}

// 내 프로필
function move_profile_page(){
    var profile_nickname = document.getElementById("profile_nickname").innerText
    profile_nickname = profile_nickname.split(' ')[1]
    window.location.href = `/public_profile.html?=${profile_nickname}`
}

//회원정보 수정 카카오 로그인은 접근 불허
function confirm_kakao_user_edit() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 회원정보 수정을 할 수 없습니다. ")}
    else{
        window.location.replace('user_edit.html')
        }
}

//비밀번호 변경 카카오 로그인 접근 불허
function confirm_kakao_change_password() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 비밀번호를 설정할 수 없습니다. ")}
    else{
        window.location.replace('change_password.html')
        }
}

// 이메일 재인증
async function resend_email() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 이메일 인증을 할 수 없습니다. ")
} else {    
    var delConfirm = confirm("이메일을 발송하시겠습니까? ")
    if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/users/email-resend/`, {
    method: "POST",
    headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("access")
    }
    })

    response_json = await response.json()

    if (response.status === 200) {
    alert(response_json["message"])
}}}}

//1:1 문의
function Report(){
    if (localStorage.getItem("access")){
        if (localStorage.getItem("payload")){
            if(JSON.parse(localStorage.getItem("payload")).is_confirmed == true){
            //구글 폼 주소
            } else{
                alert("문의를 작성하시려면 이메일 인증을 해야합니다.")
            }
        } else if (localStorage.getItem("kakao")) {
            //구글 폼 주소
        }
}}

// 계정 비활성화
async function withdrawal() {
    var delConfirm = confirm("정말 계정 비활성화를 진행하시겠습니까?")
    if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/users/`, {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })

    withdrawal_json = await response.json()
    if (response.status === 200) {
    alert(withdrawal_json["message"])
    localStorage.removeItem("kakao")
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    window.location.replace('login.html')}
    }
}

//로그아웃
async function logout(){
    var delConfirm = confirm("로그아웃을 하시겠습니까?")
    if (delConfirm) {
        const response = await fetch(`${backendBaseUrl}/users/logout/`, {

        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify({"refresh": localStorage.getItem("refresh")})
    })
    response_json = await response.json
        if (response.status === 200) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            localStorage.removeItem("kakao")
            alert("로그아웃 완료")
            window.location.replace('login.html')

        } else if (response.status === 400) {

        alert("토큰이 유효하지 않습니다.")

        } else if (response.status === 403) {
        alert("접근 권한이 없습니다.")
        }
}}