<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the create-chrome-extension and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, create-chrome-extension, bluepropane1, rbluepropane@gmail.com
-->





<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]




<br />
<p align="center">
  <a href="https://github.com/bluepropane/create-chrome-extension">
    <img src="template/src/assets/icon.png" alt="Logo" width="128" height="128">
  </a>

  <h2 align="center"><code>create-chrome-extension</code></h2>

  <p align="center">
    Fast and easy framework for development of Google Chrome extensions
    <br />
    <a href="https://github.com/bluepropane/create-chrome-extension"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/bluepropane/create-chrome-extension/issues">Report Bugs here</a>
    ·
    <a href="https://github.com/bluepropane/create-chrome-extension/issues"> Request features here</a>
  </p>
</p>



<!-- TABLE OF COTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Customizations](#customizations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)


### Features

- Fully working, zero configuration prototype in 1 minute
- ES6/Webpack included
- Hot reload extension in development
- [Preact](https://preactjs.com) included



### Prerequisites
- `nodeJS >= 10`
- `Chrome >55`
- `npm >= 6`
- `yarn` is the preferred package manager.

## Quickstart

1. Generate the boilerplate
  
         npx create-chrome-extension my-extension && cd my-extension

   This command generates a folder with named `my-extension` in the current working directory.

2. Start the development server
    
          yarn dev

   This command will produce a fully isolated development output of the extension (in `ext/`). If you have followed the official [Getting Started Tutorial][chrome-getting-started-url] for chrome extensions, you will find that the contents in this folder to be very similar to it. that you can load into your chrome browser using the `Load unpacked` method.


3. Load unpacked extension

    Navigate to `chrome://extensions` on your chrome browser and click on the `Load unpacked` button (If you don't see it, you might have to enable `Developer mode` on the top right corner of the same page first). Select the generated `ext/` folder from your project root as the target extension directory.

    ![load unpacked](https://developer.chrome.com/static/images/get_started/load_extension.png)
    
     *image: how to load unpacked extension, grabbed from [Getting Started Tutorial][chrome-getting-started-url]*



4. Voila!

    Your extension icon should appear in the extension bar now (top right corner of your chrome window). Click on it to see the boilerplate popup page. You have just completed setting up your first extension environment!



## Customizations

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/bluepropane/create-chrome-extension/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.



<!-- LICENSE -->
## License

Distributed under the GNU General Public License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

[@bluepropane1](https://twitter.com/bluepropane1) - rbluepropane@gmail.com

Project Link: [https://github.com/bluepropane/create-chrome-extension](https://github.com/bluepropane/create-chrome-extension)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* []()
* []()
* []()





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[chrome-getting-started-url]: https://developer.chrome.com/extensions/getstarted