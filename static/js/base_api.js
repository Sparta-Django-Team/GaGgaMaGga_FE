const backendBaseUrl = "http://127.0.0.1:8000"
const frontendBaseUrl = "http://127.0.0.1:5500"


async function move_profile_page(){
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
    var user_nickname = response_json.nickname
    window.location.href = `/public_profile.html?=${user_nickname}`
}
