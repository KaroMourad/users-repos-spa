
export default class Pagination {

     current_page;
     records_per_page;
     total;
     getData;
     processing;

    constructor(getData) {
        this.current_page = 1;
        this.records_per_page = 20;
        this.total = 0;
        this.getData = getData;
        this.processing = false;
    }

    initPagination = () => {
        this.setTotalCount(0);
        this.setCurrentPage(1);
        this.setRecordsPerPage(20);
        let page_span =  document.getElementById("page");
        let btn_next = document.getElementById("btn_next");
        let btn_prev = document.getElementById("btn_prev");

        btn_prev.classList.add("disable");
        btn_next.classList.add("disable");
        page_span.innerText = `Page: ${0 + "/" + this.numPages()}`;
    }

    setCurrentPage = (current_page) =>
    {
        this.current_page = current_page;
    }

    setRecordsPerPage = (records_per_page) =>
    {
        this.records_per_page = records_per_page;
    }

    setTotalCount = (total_count) =>
    {
        this.total = total_count;
    }

    setProcessing = (processing, listContainer) => {
        if(this.processing !== processing) {
            this.processing = processing;
            let btn_next = document.getElementById("btn_next");
            let btn_prev = document.getElementById("btn_prev");

            if(this.processing) {
                listContainer.innerHTML = "<div class='loader'></div>"
                btn_next.classList.add("disable");
                btn_prev.classList.add("disable");
            }else {
                listContainer.innerHTML = "";
                btn_next.classList.remove("disable");
                btn_prev.classList.remove("disable");
            }
        }
    }

    setPagination = () =>
    {
        let pagination = document.getElementById("pagination");
        if(pagination)
        {
            let page_span =  document.createElement("span");
            let btn_prev = document.createElement("button");
            let btn_next = document.createElement("button");

            btn_prev.onclick = this.prevPage;
            btn_next.onclick = this.nextPage;

            btn_prev.classList.add("disable");
            btn_next.classList.add("disable");

            btn_prev.id = "btn_prev";
            btn_next.id = "btn_next";
            page_span.id = "page";

            btn_prev.innerText = "Prev";
            btn_next.innerText = "Next";
            page_span.innerText = `Page: ${0 + "/" + this.numPages()}`;

            pagination.appendChild(btn_prev);
            pagination.appendChild(btn_next);
            pagination.appendChild(page_span);
        }
    }

    prevPage = () =>
    {
        if (this.current_page > 1 && this.total)
        {
            this.current_page--;
            this.changePage(this.current_page);
            this.getData();
        }
    }

    nextPage = () =>
    {
        if (this.current_page < this.numPages() && this.total) {
            this.current_page++;
            this.changePage(this.current_page);
            this.getData();
        }
    }

    changePage = (page) =>
    {
        let btn_next = document.getElementById("btn_next");
        let btn_prev = document.getElementById("btn_prev");
        let page_span = document.getElementById("page");

        // Validate page
        if (page < 1) page = 1;
        if (page > this.numPages()) page = this.numPages();

        page_span.innerHTML = page + "/" + this.numPages();

        if (page === 1) {
            btn_prev.style.visibility = "hidden";
        } else {
            btn_prev.style.visibility = "visible";
        }

        if (page === this.numPages()) {
            btn_next.style.visibility = "hidden";
        } else {
            btn_next.style.visibility = "visible";
        }
    }

    numPages = () =>
    {
        return Math.ceil(this.total / this.records_per_page);
    }
}