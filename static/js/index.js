import navbar from "./navbar/navbar.js";

function init()
{
    setNavBar();
    router();
}

function setNavBar() {
    const app = document.getElementById("app");
    // Create nav element.
    const nav = document.createElement("nav");
    // Set nav id.
    nav.id = "nav";
    // Append the nav node to app.
    app.appendChild(nav);

    for (let route of navbar) {
        // Create anchor element.
        const a = document.createElement("a");
        // Create the text node for anchor element.
        const link = document.createTextNode(route.state);
        // Append the text node to anchor element.
        a.appendChild(link);
        // Set the title.
        a.title = route.state;
        // Set the href property.
        a.href = route.path;
        // Set class attribute.
        a.setAttribute("class","nav_link");
        if(location.pathname === route.path) {
            a.classList.add("nav_link_active");
        }
        // Set dataset.
        a.dataset.link = "data-link";
        // Append the anchor element to the nav.
        nav.appendChild(a);
    }
}

function router()
{
    const matches = navbar.map(navBarItem =>
    {
        return {
            route: navBarItem,
            isMatch: location.pathname === navBarItem.path
        };
    });

    let match = matches.find(match => match.isMatch);
    if(!match)
    {
        location.replace(navbar[0].path);
    }
    else
    {
        setContent(match);
    }
}

function setContent(match)
{
    let content = document.getElementById("content");

    if(!content)
    {
        content = document.createElement("div");
        content.id = "content";
        content.classList.add(`${match.route.className}`);
        document.getElementById("app").appendChild(content);
    }

    loadCss(match).then(() =>
    {
        let callback;
        import( `/static/js/components/${match.route.relativePath}/${match.route.view}.js`)
            .then(({default: Component}) => new Component())
            .then(instance => {
                callback = instance.callback;
                return instance.getHTMLTemplate();
            })
            .then(templateHTML => {
                content.innerHTML = templateHTML;
                callback?.();
            });
    });
}

function loadCss(match)
{
    const cssId = "cssId:" + match.route.view;
    if (!document.getElementById(cssId)) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `/static/css/components/${match.route.relativePath}/${match.route.view}.css`;
            const head = document.getElementsByTagName('head')[0];
            head.appendChild(link);
            // loading style
            link.onload = function() {
                resolve(link);
            };
        });
    }
    else {
        return Promise.resolve();
    }
}

function linkTo(url = "/users")
{
    history.pushState(null,null, url);
    router();
}

function setActiveLink(e)
{
    e.preventDefault();
    const targetElement = e.target;
    if(targetElement?.matches("[data-link]"))
    {
       setActiveClass(targetElement);
       linkTo(targetElement.href);
    }
}

function setActiveClass(targetElement)
{
   targetElement.parentNode.childNodes.forEach(child =>
   {
       child.classList.remove("nav_link_active");
   })
   targetElement.classList.add("nav_link_active");
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () =>
{
    init();
    document.addEventListener("click", setActiveLink);
});