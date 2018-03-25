'use strict'
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const moment = require('moment');
const pug = require('pug');
const bloglinkTemplate = pug.compileFile(`${__dirname}/templates/bloglink.pug`);

const BLOG_DIR = path.resolve(__dirname, '../blog');
const fileRegExp = /([0-9]{4}-[0-9]{2}-[0-9]{2})\.html/;
const filenames = fs.readdirSync(BLOG_DIR).filter(name => fileRegExp.test(name)).sort((a, b) => a > b ? -1 : 1);

const links = filenames.map(filename => {
    const blogHtml = fs.readFileSync(`${BLOG_DIR}/${filename}`, { encoding: 'utf8' });
    const title = cheerio.load(blogHtml)('title').text();
    const date = moment(fileRegExp.exec(filename)[1]).format('MMMM Do YYYY');
    const link = `./${filename}`;
    const linkHtml = bloglinkTemplate({ title, date, link });
    return linkHtml;
}).join('\n');

const indexHtml = fs.readFileSync(`${BLOG_DIR}/index.html`, { encoding: 'utf8' });
const $ = cheerio.load(indexHtml);
$('#blogContent').empty().append(links);
console.log($.html());
