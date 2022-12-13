window.onload = function () {
    console.log("로드 완료")
    const choice = location.href.split('=')[2]
    console.log(choice)
    if (choice == 1){ 
        console.log("좋아요")
        BestLikeSort(1)
    } else {
        console.log("최신")
        recentSort(1)
    }
}

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);



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





function like_rank_show(){
    move_best_review_page(1, 1)
}

function views_rank_show(){
    move_best_review_page(1,0)
}





async function BestLikeSort(page){
    document.getElementById("like-rank").style.display ='block';
    document.getElementById("recent-rank").style.display ='none';

    document.getElementById("sort-like-button").style.color = "#FF792A";
    document.getElementById("sort-recent-button").style.color = "#9b9b9b";

    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/?page=${page}`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)
    const rank_cnt = document.getElementById("rank-cnt")
    rank_cnt.innerText = response_json.like_count_review.count
    
    // 페이지네이션
    const page_no = response_json.like_count_review.next.split('=')[1].split('/')[0]
    const last_page_no = parseInt(response_json.like_count_review.count/10)
    if (page_no-1 == 1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    } else if (page_no-1 == 2)  {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else if (page_no-1 == last_page_no) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            >
        `
    )
    } else if (page_no-1 == last_page_no-1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    }
    $('#like-rank').empty()
    response_json.like_count_review.results.forEach(item => {
        
        $('#like-rank').append(
            `
            <div class="review-list">
                <div class="place-item">
                    <div>
                        <img class="place-item-img" onclick="move_review_detail_page(${item.id},${item.place.id},${item.author_id})" src="${backendBaseUrl}${item.review_image_one}">

                    </div>
                    <div class="place-item-content">
                        <div>${item.place_name}</div>
                        <div class="rating">
                            <img src="/images/icon/star.svg">
                            <div>${item.rating_cnt}</div>
                            <div class="review-item-box">
                                <img src="/images/icon/review_fill_heart.svg">
                                <div> ${item.review_like_count}</div>
                        </div>
                    </div>
                    </div>
                </div>
                <a class="place-item-user" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img class="place-item-user-img" src="${backendBaseUrl}${item.profile_image}">
                    </div>
                    <div>
                        ${item.nickname}
                    </div>
                </a>
            </div>
            `
        )
    })

}


async function recentSort(page){
    document.getElementById("like-rank").style.display ='none';
    document.getElementById("recent-rank").style.display ='block';

    document.getElementById("sort-like-button").style.color = "#9b9b9b";
    document.getElementById("sort-recent-button").style.color = "#FF792A";

    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/?page=${page}`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)
    const rank_cnt = document.getElementById("rank-cnt")
    rank_cnt.innerText = response_json.recent_review.count
    
    // 페이지네이션
    const page_no = response_json.recent_review.next.split('=')[1].split('/')[0]
    const last_page_no = parseInt(response_json.recent_review.count/10)
    if (page_no-1 == 1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="recentSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    } else if (page_no-1 == 2)  {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="recentSort(1)">1</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="recentSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else if (page_no-1 == last_page_no) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="recentSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            >
        `
    )
    } else if (page_no-1 == last_page_no-1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="recentSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="recentSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="recentSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="recentSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="recentSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    }
    $('#recent-rank').empty()
    response_json.recent_review.results.forEach(item => {
        
        $('#recent-rank').append(
            `
            <div class="review-list">
                <div class="place-item">
                    <div>
                        <img class="place-item-img" onclick="move_review_detail_page(${item.id},${item.place.id},${item.author_id})" src="${backendBaseUrl}${item.review_image_one}">

                    </div>
                    <div class="place-item-content">
                        <div>${item.place_name}</div>
                        <div class="rating">
                            <img src="/images/icon/star.svg">
                            <div>${item.rating_cnt}</div>
                            <div class="review-item-box">
                                <img src="/images/icon/review_fill_heart.svg">
                                <div> ${item.review_like_count}</div>
                        </div>
                    </div>
                    </div>
                </div>
                <a class="place-item-user" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img class="place-item-user-img" src="${backendBaseUrl}${item.profile_image}">
                    </div>
                    <div>
                        ${item.nickname}
                    </div>
                </a>
            </div>
            `
        )
    })

}



function move_review_detail_page(review_id,place_id, author_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}`
}

function move_public_profile_page(nickname){
    window.location.href = `/public_profile.html?id=${nickname}`
}
