import AbstractComponent from "../AbstractComponent.js";
import Pagination from "../pagination/pagination.js";
import {searchRepos} from "../../../api/ReposApi.js";

export default class extends AbstractComponent {
    pagination;
    searchKey;

    constructor() {
        super();
        this.setTitle("Repos");
        this.searchKey = "";
    }

    setReposList = (repos) => {
        let reposList = document.getElementById("reposList");
        reposList.innerHTML = "";
        for (let repo of repos) {
            this.createReposItem(repo, reposList);
        }
    }

    repoItemClickHandler = (e) => {
        console.log(e, "click")
    }

    createReposItem = (repo, reposList) => {
        let repoItem = document.createElement("div");
        repoItem.classList.add("repoItem");
        repoItem.onclick = this.repoItemClickHandler;
        repoItem.innerHTML = `
            <span title="${repo.name}">
                ${repo.name} (<span title="${repo.url}">${repo.url}</span>)
            </span>
        `;
        reposList.appendChild(repoItem);
    }

    getRepos = (type) => {
        if(!this.pagination.processing) {
            let listContainer = document.getElementById("reposList");

            this.pagination.setProcessing(true, listContainer);
            searchRepos({q: this.searchKey}, {
                page: this.pagination.current_page,
                per_page: this.pagination.records_per_page
            })
                .then(data => {
                    this.pagination.setProcessing(false, listContainer);
                    if(data.items) {
                        this.setReposList(data.items);
                        this.pagination.setTotalCount(data.total_count);
                        if(type === "onEnter") {
                            this.pagination.setCurrentPage(1);
                            this.pagination.changePage(1);
                        }
                    }
                })
                .catch(err => {
                    listContainer.innerHTML = err.message;
                })
                .finally(() => this.pagination.setProcessing(false, listContainer));
        }
    }

    callback = () =>
    {
        this.pagination = new Pagination(this.getRepos);
        this.pagination.setPagination();

        const onKeyPress = (e) =>
        {
            if (e.key === 'Enter' && this.searchKey !== e.target.value)
            {
                this.searchKey = e.target.value;
                if(e.target.value === "") {
                    document.getElementById("reposList").innerHTML = "No Items";
                    this.pagination.initPagination();
                }
                else {
                    this.getRepos("onEnter");
                }
            }
        }

        const inputElem = document.querySelector('#search');
        if(inputElem) {
            inputElem.removeEventListener('keypress', onKeyPress);
            inputElem.addEventListener('keypress', onKeyPress);
        }
    }

    async getHTMLTemplate() {
        return `
             <input type="text" id="search" name="repos" placeholder="Search for repos">
             <div class="reposListContainer">
                <div id="reposList">No Items</div>
             </div>
             <div id="pagination"></div>
        `;
    }
}