const searchButton = document.querySelector('button')
const searchInput = document.querySelector('input')
const searchResultsList = document.querySelector('#search-results')

let api = "https://handmade-api-34lhk.ondigitalocean.app"
if (location.hostname == "localhost" || location.hostname == "127.0.0.1") {
    api = "http://127.0.0.1:5000"
}

searchButton.addEventListener('click', async (e) => {
    searchResultsList.innerHTML = "<p>Searching...</p>"
    const params = new URLSearchParams();
    params.append("query", searchInput.value);
    const response = await fetch(`${api}/search?${params}`, {
        method: "GET"
    });
    

    const data = await response.json()
    const results = data['results']


    searchResultsList.innerHTML = ""

    for (const element of results) {
        let title = element[1]['title']
        if (title == undefined) {
            title = element[0]
        }
        let hostname = element[1]['hostname']
        let url = element[0]

        let hostnameElement = document.createElement("p")
        let hostnameTextNode = document.createTextNode(hostname)
        hostnameElement.appendChild(hostnameTextNode)
        hostnameElement.className = "result-hostname"

        let urlElement = document.createElement("a")
        let urlTextNode = document.createTextNode(title)
        urlElement.appendChild(urlTextNode)
        urlElement.className = "result-url"
        urlElement.href = url

        let elementContainer = document.createElement("div")
        elementContainer.appendChild(hostnameElement)
        elementContainer.appendChild(urlElement)
        elementContainer.className = "search-result"

        searchResultsList.appendChild(elementContainer)
    }

    console.log(data['results'])
})