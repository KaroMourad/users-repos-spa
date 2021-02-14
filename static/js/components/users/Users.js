import AbstractComponent from "../AbstractComponent.js";
import {searchUsers} from "../../../api/UserApi.js";
import Pagination from "../pagination/pagination.js";

export default class extends AbstractComponent {
    pagination;
    searchKey;

    constructor() {
        super();
        this.setTitle("Users");
        this.searchKey = "";
    }

    setUsersList = (users) => {
        let userCardsList = document.getElementById("usersList");
        userCardsList.innerHTML = "";
        for (let user of users) {
            this.createUserCard(user, userCardsList);
        }
    }

    userCardClickHandler = (e) => {
        console.log(e, "click");
    }

    createUserCard = (user, userCardsList) => {
        let userCard = document.createElement("div");
        userCard.classList.add("userCard");
        userCard.onclick = this.userCardClickHandler;
        userCard.innerHTML = `
            <img  src="${user.avatar_url}" alt="${user.login}"/>
            <span title="${user.login}">${user.login}</span>
        `;
        userCardsList.appendChild(userCard)
    }

    getUsers = (type) => {
        if(!this.pagination.processing) {
            let listContainer = document.getElementById("usersList");

            this.pagination.setProcessing(true, listContainer);
            searchUsers({q: this.searchKey}, {
                page: this.pagination.current_page,
                per_page: this.pagination.records_per_page
            })
                .then(data => {
                    this.pagination.setProcessing(false, listContainer);
                    if(data.items) {
                        this.setUsersList(data.items);
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
        this.pagination = new Pagination(this.getUsers);
        this.pagination.setPagination();

        const onKeyPress = (e) =>
        {
            if (e.key === 'Enter' && this.searchKey !== e.target.value)
            {
                this.searchKey = e.target.value;
                if(e.target.value === "") {
                    document.getElementById("usersList").innerHTML = "No Items";
                    this.pagination.initPagination();
                }
                else {
                    this.getUsers("onEnter");
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
            <input type="text" id="search" name="users" placeholder="Search for users">
            <div class="usersListContainer">
                <div id="usersList">No Items</div>
             </div>
            <div id="pagination"></div>
        `;
    }
}