// import apiKey from '../key'

class NewsController {
    constructor() {
        this._newsSections = []

        this._getArticles()
    }

    _getArticles() {
        fetch(`https://content.guardianapis.com/search?api-key=${apiKey}&show-fields=thumbnail`)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }

            throw new Error(`Couldn't connect to server.`)
        })
        .then(responseJson => {
            this._categoriseNews(responseJson.response.results)
            this._updateDom()
        })
        .catch(error => console.log(error))
    }

    _categoriseNews (articles) {
        articles.forEach(article => {
            const existingNewsSection = this._newsSections.find(newsSection => {
                return newsSection.title === article.sectionName
            })

            if (existingNewsSection) {
                existingNewsSection.articles.push(article)
            } else {
                this._newsSections.push({
                    title: article.sectionName,
                    articles: [article]
                })
            }
        })
    }

    _updateDom(){
        const articleElement = document.querySelector('#articles')
        articlesElement.innerHTML = ''

        this._newsSections.forEach(newsSection => {
            articlesElement.innerHTML += `
                <div class="section-heading">
                    <h2>${newsSection.title}</h2>
                </div>
            `

            newsSection.articles.forEach(article => {
                const thumbnail = article.fields ? `<img src="${article.fields.thumbnail}" class="thumbnail"></img>` : ``

                articlesElement.innerHTML += `
                <a href="https://theguardian.com/${article.id}" class="article">
                    ${thumbnail}
                        <div class="title">
                            <h3>${article.webTitle}</h3>
                        </div>
                </a>
                `
            })
        })
    }
}