const axios = require('axios');
// const cheerio = require('cheerio');
// const htmlparser2 = require('htmlparser2');



async function getImgUrlByTerm(search = 'background') {
    try {
        const res = await axios.get(`https://api.unsplash.com/search/photos?client_id=jDAQjNPjVQDU_46JxFiBQjPksjx3xWun085OAFM8HWY&per_page=30&query=${search}`)
        return res.data.results
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getImgUrlByTerm
}