import {get} from "./fetchApi.js";

const search = "https://api.github.com/search";

export function searchUsers(data= {}, pagination= {page: 1, per_page: 20})
{
    return get(`${search}/users`, {...data, ...pagination});
}