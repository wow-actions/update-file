import * as core from '@actions/core'
import * as github from '@actions/github'

function getOctokit() {
  const token = core.getInput('GITHUB_TOKEN', { required: true })
  return github.getOctokit(token)
}

async function getContent(
  octokit: ReturnType<typeof getOctokit>,
  path: string,
) {
  try {
    return await octokit.rest.repos.getContent({
      ...github.context.repo,
      path,
    })
  } catch (e) {
    return null
  }
}

function detect(
  lines: string[],
  openingComment: string,
  closingComment: string,
) {
  let startIndex = -1
  let endIndex = -1
  let hasStart = false
  let hasEnd = false

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!hasStart && line.includes(openingComment)) {
      startIndex = i
      hasStart = true
    } else if (!hasEnd && line.includes(closingComment)) {
      endIndex = i
      hasEnd = true
    }
    if (hasStart && hasEnd) {
      break
    }
  }

  return {
    hasStart,
    hasEnd,
    startIndex,
    endIndex,
  }
}

function getOptions() {
  return {
    path: core.getInput('path'),
    content: core.getInput('content'),
    commitMessage: core.getInput('commit_message'),
    openingComment: core.getInput('opening_comment'),
    closingComment: core.getInput('closing_comment'),
    warningComment: core.getInput('warning_comment'),
  }
}

async function run() {
  try {
    const options = getOptions()
    const octokit = getOctokit()
    const { path } = options

    core.debug(JSON.stringify(options, null, 2))

    const res = await getContent(octokit, path)
    if (res == null) {
      core.setFailed(
        `Should specify a valid file path, check the input of "path"`,
      )
      return
    }

    const oldContent = Buffer.from(
      (res.data as any).content,
      'base64',
    ).toString()
    const lines = oldContent.split('\n')
    const detection = detect(
      lines,
      options.openingComment,
      options.closingComment,
    )

    core.debug(JSON.stringify(detection, null, 2))

    if (!detection.hasStart) {
      core.setFailed(
        `The opening comment "${options.openingComment}" not found in the target file`,
      )
      return
    }

    if (!detection.hasEnd) {
      core.setFailed(
        `The closing comment "${options.closingComment}" not found in the target file`,
      )
      return
    }

    const { startIndex, endIndex } = detection
    const dropCount = endIndex - startIndex + 1
    lines.splice(
      startIndex,
      dropCount,
      options.openingComment,
      options.warningComment,
      options.content,
      options.closingComment,
    )

    const content = lines.join('\n')

    if (oldContent !== content) {
      await octokit.rest.repos.createOrUpdateFileContents({
        ...github.context.repo,
        path: options.path,
        content: Buffer.from(content).toString('base64'),
        message: options.commitMessage,
        sha: res ? (res.data as any).sha : undefined,
      })
      core.info(`File "${options.path}" updated`)
    } else {
      core.info(`File "${options.path}" no need to update`)
    }
  } catch (e) {
    core.error(e)
    core.setFailed(e.message)
  }
}

run()
