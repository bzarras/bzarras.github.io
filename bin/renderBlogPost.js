'use strict';
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const marked = require('marked');
const pug = require('pug');

const blogPostTemplate = pug.compileFile(`${__dirname}/templates/blogpost.pug`);

// Read standard input and then send the full input to render()
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) input += chunk;
});
process.stdin.on('end', () => {
    const html = render(input);
    console.log(html);
    process.exit(0);
});

function render(markdown) {
    const blogHtml = marked(markdown);
    const title = cheerio.load(blogHtml)('h1').text();
    const htmlPage = blogPostTemplate({ title });
    const $ = cheerio.load(htmlPage);
    $('#blogContent').append(blogHtml);
    return $.html();
}
