function ShowCard () {
    return (
        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
            <div class="bg-white rounded-4 shadow-sm profile">
                <div class="d-flex align-items-center px-3 pt-3">
                    <div class="ms-3">
                        <h6 class="mb-0 d-flex align-items-start text-body fs-6 fw-bold">Shay Jordon <span class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon">done</span></h6>
                        <p class="text-muted mb-0">@shay-jordon</p>
                    </div>
                    <div class="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group">
                        <input type="checkbox" class="btn-check" id="btncheck1"/>
                        <label class="btn btn-outline-primary btn-sm px-3 rounded-pill" for="btncheck1"><span class="follow">+ Follow</span><span class="following d-none">Following</span></label>
                    </div>
                </div>
                <div class="p-3">
                    <p class="mb-2 fs-6">The standard chunk of Lorem Ipsum used since is reproduced. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature..</p>
                    <p class="d-flex align-items-center mb-3"><span class="material-icons me-2 rotate-320 text-muted md-16">link</span><a href="profile.html" class="text-decoration-none">profile/shayjordon</a>
                        <span class="material-icons me-2 text-muted md-16 ms-4">calendar_today</span><span>Joined on Feb 2023</span>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default ShowCard