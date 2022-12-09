const getnickname = location.href.split('=')[1]
const user_nickname = decodeURI(getnickname)

const getvalue = location.href.split('=')[2]
const follow_value = decodeURI(getvalue)

console.log(follow_value)
function followershow(){
    $('#follower').show();
    $('#following').hide();
}
function followingshow(){
    $('#follower').hide();
    $('#following').show();
}

// 팔로우
async function follow() {
    const response = await fetch(`${backendBaseUrl}/users/profiles/${user_nickname}/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access"),
        }})


    response_json = await response.json()
    console.log(response_json)


    // 프로필
    const profile_nickname = document.getElementById("profile_nickname") 
    profile_nickname.innerText = response_json.nickname


    // 팔로워
    response_json.followers.forEach(item => {
        console.log(item.nickname)
        $('#follower').append(
            `
            <div class="profile">
                <div class = "img">
                    <a onclick="move_profile_page('${item.nickname}')">
                    <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
                    </a>
                </div>
                <div style="width: 77%;">
                    <a onclick="move_profile_page('${item.nickname}')">${item.nickname}</a>
                </div>
            </div>
            `
        )
    });
 
    // 팔로잉
    response_json.followings.forEach(item => {
        $('#following').append(
            `
            <div class="profile">
                <div class = "img">
                    <a onclick="move_profile_page('${item.nickname}')">
                    <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
                    </a>
                </div>
                <div style="width: 77%;">
                    <a onclick="move_profile_page('${item.nickname}')">${item.nickname}</a>
                </div>
            </div>
            `
        )
    });

    if(follow_value == 'follower'){
        followershow()
    }
    else{
        followingshow()
    }
    
}

follow()

function move_profile_page(click_nickname){
    console.log(click_nickname)
    window.location.href = `/public_profile.html?=${click_nickname}`
}
