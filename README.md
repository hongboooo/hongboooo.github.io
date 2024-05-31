# Welcome to [Juniper's website!](https://juniper1106.github.io/zy_cheng/)

This website is forked from [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) and edited and maintained by Zhuoyi Cheng.

# Updates

- 05.31.2024, modified the navbar, body, and sidebar layout, now they are fully responsive!!! (unless you device is smaller than 260px lol.)
- 04.29.2024, build customized Working blocks.
- 04.26.2024, forked this template and published my personal website!

# Building Logs

The following three websites solves most of the starter's problems:

1. [https://academicpages.github.io/](https://academicpages.github.io/)
2. [https://github.com/academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io)
3. [https://mmistakes.github.io/minimal-mistakes/](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)

## Render Correctly

1. Set site-wide configuration and create content & metadata. If you forked and deployed the Github Pages without making any changes, you'll find your websited not rendered correctly, and that's because you didn't change some default settings in the \_config.yml file. The author also kindly offered an [example](https://archive.is/3TPas) which will lead you through.
2. Notice that even if you didn't name your repository as "[your GitHub username].github.io", "url" in the basic site settings is still "https://[your GitHub username].github.io".
3. What if you made some changes to \_config.yml, commited changes and refreshed your page, it's still not correctedly rendered? Just wait some time, or go to "Actions" to see if the most recent workflow has completed or not.

## Run Locally (on Windows, using VS Code and Github Desktop)

### The Environment

Setting up the local environment most be the moooooost annoying step across the whole process! None of the above three sites provides enough information about how to run locally on Windows. You should refer to the [official doc](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) of Github Pages and the [manual](https://jekyllrb.com/docs/installation/windows/) offered by jekyll to make things clear. Your ultimate goal in this stage is no error info appears when running `gem -v`, `ruby -v`, `bundle -v` and `jekyll -v` in command line, which means you have succefully installed the ruby development environment, gem package manager and jekyll to your computer.

### Run locally with VS Code

First, you should run `bundle list` in the command line in VS Code to get all dependencies you need. Then you can try to run `jekyll serve -l -H localhost`. I met two problems when running `jekyll serve -l -H localhost` in VS Code, one is the **TZInfo** problem, and another is **jekyll-sass-converter 3.0.0 problem**.

Solutions were quite direct as they were provided in the error info. For the former one, refer to [tzinfo Github](https://github.com/tzinfo/tzinfo/wiki/Resolving-TZInfo::DataSourceNotFound-Errors), and for the latter one, just do as what the error info told you: Prepending `bundle exec` to your command may solve this, that is, run `bundle exec jekyll serve -l -H localhost` instead.

## Beautify
### Flex navbar
The original navbar was kinda...ugly because of ill alignment. I did the following:

1. Included all navbar items (the name, menu items, and the hidden button) in a new flex div.
2. Separate the three items.
   1. As the name and menu items were previously controlled by the class "visible-links", the two were both included in a ul with "visible-links" class in case unexpected situation happens (still happened, the codes were sooooooooooo intertwined!!!).
   2. button was moved to last.
   3. Some other refurbishments.

Step 2 led to a consequence that the button would never show up due to its impact on the `updateNav()` function in js file. But I don't wanna give up the neat flex layout or make major revisions to masthead.html. So I defined a "button-compulsory" class to set a breakpoint at 520px and compulsurily controlled its display and visibility :\) (corresponding modifications were also made to other navbar items). 