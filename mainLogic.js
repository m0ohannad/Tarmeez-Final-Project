const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI() {
    const token = localStorage.getItem("token");

    const loginDiv = document.getElementById("logged-in-div");
    const logoutDiv = document.getElementById("logout-div");
    const addBtn = document.getElementById("add-btn");
    const navUsername = document.getElementById("nav-username");
    const navUserImage = document.getElementById("nav-user-image");

    if (token == null) { // user is guest (not logged in)
        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important");
        }
        loginDiv.style.setProperty("display", "flex", "important");
        logoutDiv.style.setProperty("display", "none", "important");
    } else { // user is logged in  
        if (addBtn != null) {
            addBtn.style.setProperty("display", "block", "important");
        }
        loginDiv.style.setProperty("display", "none", "important");
        logoutDiv.style.setProperty("display", "flex", "important");
        navUsername.innerText = "@" + getCurrentUser().username;
        navUserImage.src = getCurrentUser().profile_image ?? './pofile-pics/picture-profile';
    }
}

// ======== AUTH FUNCTIONS ========= //
function loginBtnClicked() {
    // alert("Login button clicked");
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("Password-input").value;

    console.log("username: " + username);
    console.log("password: " + password);

    const params = {
        "username": username,
        "password": password
    }

    const url = `${baseUrl}/login`;

    axios.post(url, params)
        .then((response) => {
            // const data = response.data;
            // console.log(response.data.token);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // document.getElementById("login-modal").style.display = "none";
            const loginModal = document.getElementById("login-modal");
            const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
            loginModalInstance.hide();

            // alert("Login successful");
            showAlert("Logged in successfully");

            setupUI();
        })


}

function registerBtnClicked() {
    // console.log("Register button clicked");
    const name = document.getElementById("register-name-input").value;
    const username = document.getElementById("register-username-input").value;
    const password = document.getElementById("register-password-input").value;
    const image = document.getElementById("register-image-input").files[0];

    console.log("name: " + name);
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("image: " + image);

    let formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);

    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
    }

    const url = `${baseUrl}/register`;

    axios.post(url, formData, {
        headers: headers
    })
        .then((response) => {
            const data = response.data;
            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // document.getElementById("register-modal").style.display = "none";
            const registerModal = document.getElementById("register-modal");
            const registerModalInstance = bootstrap.Modal.getInstance(registerModal);
            registerModalInstance.hide();

            // alert("Register successful");
            showAlert("New User Registered Successfully");

            setupUI();
        }).catch((error) => {
            const errMessage = error.response.data.message
            console.log(errMessage);
            showAlert(errMessage, 'danger');
        })
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    showAlert("Logged out successfully");
    setupUI();
}

function showAlert(cusomMessage, msgType = 'success') {
    const alertPlaceholder = document.getElementById('success-alert')

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(cusomMessage, msgType)

    // todo: hide alert after 3 seconds
    setTimeout(() => {
        // const alert = document.getElementById("success-alert");
        // const alertInstance = bootstrap.Alert.getInstance(alert);
        // alertInstance.hide();

        // const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // alert.close()
    }, 3000)

    // const alertTrigger = document.getElementById('liveAlertBtn')
    // if (alertTrigger) {
    //     alertTrigger.addEventListener('click', () => {
    //         appendAlert('Nice, you triggered this alert message!', 'success')
    //     })
    // }
}

function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }
    return user;
}

