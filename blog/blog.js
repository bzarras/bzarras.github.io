/** NOTES
* The submit function that gets called in the Prismic Api takes a function, which means
* things I want to appear on the page need to be done inside there because
* otherwise the data might not exist yet.
*/

$("document").ready(function(){

  Prismic.Api('https://brooklynben.prismic.io/api', function (err, Api) {
  	Api.form("everything")
  	.ref(Api.master())
  	.query(Prismic.Predicates.at("document.type", "blog"))
  	// the function passed to submit is a callback and thus work needs to be done inside it.
  	.submit(function (err, response) {
  		var results = response.results; // Array
  		var mainContent = $("#blogContent");
  		var title;
  		var body;
  		var date;

  		for (var i = 0; i < results.length; i++) {
        // getting chunks of data from the prismic array
  			title = results[i].getStructuredText("blog.title").asText();
  			body = results[i].getStructuredText("blog.body").asHtml();
  			date = results[i].get("blog.date").asText();
        // chop the ugly parts off the date
        date = date.substring(4, 15);
        // create elements to put the data in
        var articleElem = $("<article></article>");
        var titleElem = $("<h2></h2>");
        titleElem.addClass("blog-title");
        var dateElem = $("<div></div>");
        dateElem.addClass("blog-date");
        var bodyElem = $("<div></div>");
        // apppend the article element to the DOM
        mainContent.append(articleElem);
        // append the sections of the blog post to the article
        articleElem.append(titleElem);
  			articleElem.append(dateElem);
  			articleElem.append(bodyElem);
        // append the data to its respective sections
        titleElem.append(title);
        dateElem.append(date);
        bodyElem.append(body);
  		}

  	});
  }, "MC5WalZTMng4QUFOa3gyVFRW.77-9O--_vTdY77-9Z--_ve-_vXvvv73vv71mZRsrTlA-77-977-977-977-977-9J--_ve-_vTLvv715Cls");

}); // End jQuery document.ready function
