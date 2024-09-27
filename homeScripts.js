
let currentPage = 0;
let lastpage = 1;

// =========== IFIINITE SCROLL ===========//

window.addEventListener("scroll", function () {
    const threshold = 100; // يمكنك تعديل هذه القيمة حسب الحاجة
    // const endOfPage = window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight - threshold;
    const endOfPage = window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight;

    if (endOfPage && currentPage < lastpage) {
        console.log("End of page reached");
        getPosts(++currentPage);
    }


    // if(window.scrollY + window.innerHeight +1 >= document.documentElement.scrollHeight)

    console.log("endOfPage: " + endOfPage);
});

// ========= END IFIINITE SCROLL =========//

setupUI()
// document.getElementById("posts").innerHTML = "";
getPosts(++currentPage, true);

function getPosts(page = 1, reload = false) {


    if (reload) {
        document.getElementById("posts").innerHTML = "";
    }
    // axios.get(`${baseUrl}/posts?limit=5&page=3621`)
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
        .then((response) => {
            lastpage = response.data.meta.last_page;

            const posts = response.data.data;
            // console.log("posts is:");
            // console.log(posts);


            for (post of posts) {

                const author = post.author;

                let tagsContent = `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; cursor: auto;">
                        Doesn't have tags
                    </button>
                `;

                let user = getCurrentUser();
                let isMyPost = user != null && user.id == author.id;
                let editBtn = isMyPost ? `
                    <button class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
                    edit
                    </button>
                ` : "";

                // post.tags = ["tag1", "tag2", "tag3"];

                if (post.tags && post.tags.length > 0) {
                    tagsContent = "";
                    post.tags.forEach(tag => {
                        // console.log(tag.name);
                        tagsContent += `
                            <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                                ${tag.name}
                            </button>
                        `;
                    });
                }

                let content = `
            <!-- POST -->
            <div class="d-flex justify-content-center mt-5">
                <div class="col-9">
                    <div class="card shadow">
                        <div class="card-header">
                            <img src="${author.profile_image ? author.profile_image : './pofile-pics/picture-profile-icon-male.jpg'}" alt="picture of ${author.username} profile"
                                class="img-thumbnail rounded-circle border-1" style="height: 40px; width: 40px;"
                                onerror="this.onerror=null; this.src='./pofile-pics/picture-profile-icon-male.jpg';">
                            <b">@${author.username}</b>

                            ${editBtn}
                        </div>
                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                            <img src="${post.image ? post.image : './placeholders/Green-Tree.jpeg'}" alt="Image of post ${post.title ? 'titled \'' + post.title + '\'' : ""}" class="w-100">

                            <h6 style="color: rgb(193, 193, 193);" class="mt-1">
                                ${post.created_at}
                            </h6>

                            <h5>
                                ${post.title ? post.title : "Post Title"}
                            </h5>

                            <p>
                            ${post.body ? post.body : "Post body"}
                            </p>

                            <hr>

                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span>
                                (${post.comments_count}) Comments

                                    <span">
                                        ${tagsContent}
                                    </span>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--// POST //-->
            `;

                document.getElementById("posts").innerHTML += content;

            }
        })
}

// showSuccessAlert();

function CreateNewPostClicked() {
    // console.log("Create new post button clicked");
    let postID = document.getElementById("post-id-input").value;
    console.log("postID: " + postID);
    let isCreate = postID == "false" || postID == "" || postID == null;
    console.log("isCreate: " + isCreate);



    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById("post-image-input").files[0];

    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);

    let url = ``;
    if (isCreate) {
        url = `${baseUrl}/posts`;
    }
    else {
        url = `${baseUrl}/posts/${postID}`;
        formData.append("_method", "PUT");
    }
    // const url = `${baseUrl}/posts`;
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    }

    axios.post(url, formData, {
        headers: headers
    })
        .then((response) => {
            console.log(url);
            console.log(response.data);
            const postModal = document.getElementById("create-post-modal");
            const postModalInstance = bootstrap.Modal.getInstance(postModal);
            postModalInstance.hide();
            showAlert("New Post Has Been Created Successfully");
            getPosts(currentPage, true);
        }).catch((error) => {
            // console.log(error.response.data.message);
            const errMessage = error.response.data.message
            showAlert(errMessage, 'danger');
        })
}

function postClicked(postId) {
    // console.log("Post clicked: " + postId);
    window.location = `postDetails.html?postId=${postId}`;
}

function editPostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject));
    console.log(post);

    document.getElementById("post-modal-submit-btn").innerText = "Update";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-modal-title").innerText = "Edit Post";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    let posModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
    posModal.toggle();
}

function addBtnClicked() {
    document.getElementById("post-modal-submit-btn").innerText = "Create";
    document.getElementById("post-id-input").value = "";
    document.getElementById("post-modal-title").innerText = "Create Post";
    document.getElementById("post-title-input").value = "";
    document.getElementById("post-body-input").value = "";
    let posModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
    posModal.toggle();
}