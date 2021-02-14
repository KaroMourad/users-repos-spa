import {get} from "./fetchApi.js";

const search = "https://api.github.com/search";

export function searchRepos(data= {}, pagination= {page: 1, per_page: 20})
{
    return get(`${search}/repositories`, {...data, ...pagination});
}