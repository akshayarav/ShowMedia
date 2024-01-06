function SearchBar() {
    return (
        <aside class="col col-xl-3 order-xl-3 col-lg-6 order-lg-3 col-md-6 col-sm-6 col-12">
            <div class="fix-sidebar">
                <div class="side-trend lg-none">
                    <div class="sticky-sidebar2 mb-3">
                        <div class="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-white">
                            <span class="input-group-text material-icons border-0 bg-white text-primary">search</span>
                            <input type="text" class="form-control border-0 fw-light ps-1" placeholder="Find Users" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SearchBar