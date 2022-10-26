<h1 align="center">Update File</h1>

<p align="center">
  <a href="/LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/wow-actions/update-file?style=flat-square"></a>
  <a href="https://www.typescriptlang.org" rel="nofollow"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
  <a href="https://github.com/wow-actions/update-file/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square" ></a>
  <a href="https://github.com/marketplace/actions/update-file" rel="nofollow"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=marketplace&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6" ></a>
  <a href="https://github.com/wow-actions/update-file/actions/workflows/release.yml"><img alt="build" src="https://img.shields.io/github/workflow/status/wow-actions/update-file/Release/master?logo=github&style=flat-square" ></a>
  <a href="https://lgtm.com/projects/g/wow-actions/update-file/context:javascript" rel="nofollow"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/wow-actions/update-file.svg?logo=lgtm&style=flat-square" ></a>
</p>

<p align="center">
  <strong>Automatically update a file by replace marked section with the given content</strong>
</p>

## 🚀 Usage

1. Specify the location to update in your the file by adding `opening_comment` and `closing_comment`. Such as you can add comments in your markdown file:

```md
<!-- [START AUTO UPDATE] -->
<!-- [END AUTO UPDATE] -->
```

2. Create a `.github/workflows/update-file.yml` file in the repository you want to install this action, then add the following to it:

```yml
name: Update File
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: wow-actions/update-file@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          path: README.md
          content: 'Updated by update-file action'
```

## Inputs

Various inputs are defined to let you configure the action:

> Note: [Workflow command and parameter names are not case-sensitive](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#about-workflow-commands).

| Name | Description | Default |
| --- | --- | --- |
| `GITHUB_TOKEN` | The GitHub token for authentication | N/A |
| `badges` | Badges to add | N/A |
| `path` | File path to update | N/A |
| `content` | Content to update the file | N/A |
| `commit_message` | Commit message when update the file | `'chore: update [skip ci]'` |
| `opening_comment` | The comment to match the start line of section to update | `'<!-- [START AUTO UPDATE] -->'` |
| `closing_comment` | The comment to match the end line of section to update | `'<!-- [END AUTO UPDATE] -->'` |
| `warning_comment` | The comment to match the end line of section to update | `'<!-- Please keep comment here to allow auto-update -->'` |

## 🔖 License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
