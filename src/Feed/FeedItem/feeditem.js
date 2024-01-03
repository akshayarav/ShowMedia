import Feed from "../feed"

function FeedItem () {
    return (
        <div class="bg-white p-3 feed-item rounded-4 mb-3 shadow-sm">
        <div class="d-flex">
            <img src="img/rmate2.jpg" class="img-fluid rounded-circle user-img" alt="profile-img" />
            <div class="d-flex ms-3 align-items-start w-100">
                <div class="w-100">
                    <div class="d-flex align-items-center justify-content-between">
                        <a href="profile.html" class="text-decoration-none d-flex align-items-center">
                            <h6 class="fw-bold mb-0 text-body">Shay Jordon</h6>
                            <span class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon">done</span>
                            <small class="text-muted ms-2">@shay-jordon</small>
                        </a>
                        <div class="d-flex align-items-center small">
                            <p class="text-muted mb-0">19 Feb</p>
                            <div class="dropdown">
                                <a href="#" class="text-muted text-decoration-none material-icons ms-2 md-20 rounded-circle bg-light p-1" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">more_vert</a>
                                <ul class="dropdown-menu fs-13 dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item text-muted" href="#"><span class="material-icons md-13 me-1">edit</span>Edit</a></li>
                                    <li><a class="dropdown-item text-muted" href="#"><span class="material-icons md-13 me-1">delete</span>Delete</a></li>
                                    <li><a class="dropdown-item text-muted" href="#"><span class="material-icons md-13 me-1 ltsp-n5">arrow_back_ios arrow_forward_ios</span>Embed Vogel</a></li>
                                    <li><a class="dropdown-item text-muted d-flex align-items-center" href="#"><span class="material-icons md-13 me-1">share</span>Share via another apps</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="my-2">
                        <p class="mb-3 text-primary">Welcome to the Vogel family 🙂</p>
                        <ul class="list-unstyled mb-3">
                            <li>1. Follow people you like by clicking on the ’+ Follow’ button to see their posts in your feed.</li>
                            <li>2. Share your thoughts with others and gain a following.</li>
                        </ul>
                        <p class="text-dark">Happy Vogel to you!</p>
                        <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                            <img src="img/post1.png" class="img-fluid rounded mb-3" alt="post-img" />
                        </a>
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <div>
                                <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-20 me-2">thumb_up_off_alt</span><span>30.4k</span></a>
                            </div>
                            <div>
                                <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-20 me-2">chat_bubble_outline</span><span>4.0k</span></a>
                            </div>
                            <div>
                                <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-20 me-2">repeat</span><span>617</span></a>
                            </div>
                            <div>
                                <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-18 me-2">share</span><span>Share</span></a>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-3" data-bs-toggle="modal" data-bs-target="#commentModal">
                            <span class="material-icons bg-white border-0 text-primary pe-2 md-36">account_circle</span>
                            <input type="text" class="form-control form-control-sm rounded-3 fw-light" placeholder="Write Your comment" />
                        </div>
                        <div class="comments">
                            <div class="d-flex mb-2">
                                <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                    <img src="img/rmate1.jpg" class="img-fluid rounded-circle" alt="commenters-img" />
                                </a>
                                <div class="ms-2 small">
                                    <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                        <div class="bg-light px-3 py-2 rounded-4 mb-1 chat-text">
                                            <p class="fw-500 mb-0">Macie Bellis</p>
                                            <span class="text-muted">Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolor.</span>
                                        </div>
                                    </a>
                                    <div class="d-flex align-items-center ms-2">
                                        <a href="#" class="small text-muted text-decoration-none">Like</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <a href="#" class="small text-muted text-decoration-none">Reply</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <span class="small text-muted">1h</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex mb-2">
                                <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                    <img src="img/rmate3.jpg" class="img-fluid rounded-circle" alt="commenters-img" />
                                </a>
                                <div class="ms-2 small">
                                    <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                        <div class="bg-light px-3 py-2 rounded-4 mb-1 chat-text">
                                            <p class="fw-500 mb-0">John Smith</p>
                                            <span class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
                                        </div>
                                    </a>
                                    <div class="d-flex align-items-center ms-2">
                                        <a href="#" class="small text-muted text-decoration-none">Like</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <a href="#" class="small text-muted text-decoration-none">Reply</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <span class="small text-muted">20min</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex mb-2">
                                <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                    <img src="img/rmate2.jpg" class="img-fluid rounded-circle" alt="commenters-img" />
                                </a>
                                <div class="ms-2 small">
                                    <a href="#" class="text-dark text-decoration-none" data-bs-toggle="modal" data-bs-target="#commentModal">
                                        <div class="bg-light px-3 py-2 rounded-4 mb-1 chat-text">
                                            <p class="fw-500 mb-0">Shay Jordon</p>
                                            <span class="text-muted">With our vastly improved notifications system, users have more control.</span>
                                        </div>
                                    </a>
                                    <div class="d-flex align-items-center ms-2">
                                        <a href="#" class="small text-muted text-decoration-none">Like</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <a href="#" class="small text-muted text-decoration-none">Reply</a>
                                        <span class="fs-3 text-muted material-icons mx-1">circle</span>
                                        <span class="small text-muted">10min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default FeedItem