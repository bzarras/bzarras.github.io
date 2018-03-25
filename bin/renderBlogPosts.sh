#!/usr/bin/env bash

# =======================
#
# This script takes markdown files from static/blogposts and
# compiles them into html files in the blog directory.
# It expects the markdown files to be in the format of:
#     YYYY-mm-dd.md
#
# The script also adds links to the blog posts to the blog/index.html file
#
# =======================
path_to_blogposts=static/blogposts
filenames=$(ls $path_to_blogposts)

for filename in $filenames
do
    # Expect filenames to look like "filename.md", so tokenize it so
    # we can get rid of the .md extension
    filename_tokens=($(echo $filename | tr "." " "))
    # Grab just the name without the extension
    pretty_name=${filename_tokens[0]}
    # Pipe the file into the renderBlogPost script and then redirect output to an html file
    cat $path_to_blogposts/$filename | node bin/renderBlogPost.js > blog/$pretty_name.html
    echo "Created blog/$pretty_name.html"
done

# Now that the indiviudal blog pages are built, render the index file
# We can't write to blog/index.html as we're reading from it, so we write first to a temp file
echo "Building new index file"
node bin/renderBlogIndex.js > blog/tempIndex.html
rm blog/index.html
echo "Removed old index file"
mv blog/tempIndex.html blog/index.html
echo "Successfully created blog/index.html"
