![logo](https://user-images.githubusercontent.com/300/72754003-75b47b80-3b7b-11ea-89fe-5762aeec7c85.png)

## Creating a Blog Post

Here's a video to walk you through creating a blog post:

[![Video embed](https://img.youtube.com/vi/8hhchF8-oAo/0.jpg)](https://www.youtube.com/watch?v=8hhchF8-oAo)

And here's a cheatsheet for the most common Markdown elements:

<table class="table table-bordered">
  <thead class="thead-light">
    <tr>
      <th>Element</th>
      <th>Markdown Syntax</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#headings">Heading</a></td>
      <td><code># H1<br>
          ## H2<br>
          ### H3</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#bold">Bold</a></td>
      <td><code>**bold text**</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#italic">Italic</a></td>
      <td><code>*italicized text*</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#blockquotes-1">Blockquote</a></td>
      <td><code>&gt; blockquote</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#ordered-lists">Ordered List</a></td>
      <td><code>
        1. First item<br>
        2. Second item<br>
        3. Third item<br>
      </code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#unordered-lists">Unordered List</a></td>
      <td>
        <code>
          - First item<br>
          - Second item<br>
          - Third item<br>
        </code>
      </td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#code">Code</a></td>
      <td><code>`code`</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#horizontal-rules">Horizontal Rule</a></td>
      <td><code>---</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#links">Link</a></td>
      <td><code>[title](https://www.example.com)</code></td>
    </tr>
    <tr>
      <td><a href="https://www.markdownguide.org/basic-syntax/#images-1">Image</a></td>
      <td><code>![alt text](image.jpg)</code></td>
    </tr>
  </tbody>
</table>

## Technical Stuff

This site was created with CameronJS and deployed to Netlify. It uses TailwindCSS for styling and Stimulus for JS.

Simply commit to the GitHub repo and Netlify will build and redeploy the site.

## Local Development

    yarn global add cameronjs
    cameronjs dev

To build locally:

    yarn build

See https://cameronjs.com for more documentation for working with CameronJS.
