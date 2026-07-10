const searchButton = document.querySelector('#search-button')
const randomButton = document.querySelector('#random-button')
const searchInput = document.querySelector('input')
const searchResultsList = document.querySelector('#search-results')

document.addEventListener('DOMContentLoaded', (e) => {
    let params = new URL(document.location.toString()).searchParams;
    let query = params.get('query')

    if (query == null || query == undefined) {
        return
    } else {
        search(e)
    }
})

let api = "https://handmade-api-34lhk.ondigitalocean.app"
if (location.hostname == "localhost" || location.hostname == "127.0.0.1") {
    api = "http://127.0.0.1:5000"
}

searchButton.addEventListener('click', searchButtonPressed)
searchInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click()
    }
})
randomButton.addEventListener('click', random)

async function random(event) {
    randomButton.textContent = "Redirecting..."
    const response = await fetch(`${api}/random`, {
        method: "GET"
    });
    const data = await response.json()
    window.location = data['url']['url']
}

async function searchButtonPressed(event) {
    const params = new URLSearchParams();
    params.append("query", searchInput.value);
    window.location.href = `${window.location.pathname}?${params}`
}

async function search(event) {
    searchResultsList.innerHTML = "<p>Searching...</p>"
    let params = new URL(document.location.toString()).searchParams;
    let query = params.get('query')

    searchInput.value = query

    const response = await fetch(`${api}/search?${params}`, {
        method: "GET"
    });
    

    const data = await response.json()
    const results = data['results']

    searchResultsList.innerHTML = ""

    for (const element of results) {
        let title = element[1]['title']
        let description = element[1]['description']
        if (title == undefined) {
            title = element[0]
        }
        let hostname = element[0]
        let url = 'https://' + element[0]

        let elementContainer = document.createElement("div")
        let divResultsHeader = document.createElement("div")
        divResultsHeader.className = 'result-header'

        let faviconElement = document.createElement("img")
        faviconElement.className = 'result-favicon'
        faviconElement.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=64`
        divResultsHeader.appendChild(faviconElement)

        let divResultsHeaderText = document.createElement("div")
        divResultsHeaderText.className = 'result-header-text'

        let urlElement = document.createElement("a")
        let urlTextNode = document.createTextNode(title)
        urlElement.appendChild(urlTextNode)
        urlElement.className = "result-url"
        urlElement.href = url
        divResultsHeaderText.appendChild(urlElement)

        let hostnameElement = document.createElement("p")
        let hostnameTextNode = document.createTextNode(hostname)
        hostnameElement.appendChild(hostnameTextNode)
        hostnameElement.className = "result-hostname"
        divResultsHeaderText.appendChild(hostnameElement)

        divResultsHeader.appendChild(divResultsHeaderText)
        elementContainer.appendChild(divResultsHeader)

        let websiteDescription = document.createElement("p")
        let websiteDescriptionTextNode = document.createTextNode(description || "No description")
        websiteDescription.appendChild(websiteDescriptionTextNode)
        elementContainer.appendChild(websiteDescription)

        let childrenPageList = document.createElement("ol")
        let childPages = element[1]['pages']
        childPages.forEach(page => {
            let pageElement = document.createElement('li')
            let pageURLElement = document.createElement("a") 
            let pageURLTextNode = document.createTextNode(`~${page[1]['path']}`) 
            pageURLElement.appendChild(pageURLTextNode)
            pageURLElement.href = page[0]
            pageElement.appendChild(pageURLElement)
            childrenPageList.appendChild(pageElement)
        });
        childrenPageList.className = 'search-result-subpages'

        elementContainer.appendChild(childrenPageList)
        elementContainer.className = "search-result"

        searchResultsList.appendChild(elementContainer)
    }

    if (results.length == 0) {
        searchResultsList.innerHTML = `<p>There are no entries with ALL the words in your query.</p>`
    }

    console.log(data['results'])
}