const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const octokit = github.getOctokit(core.getInput("token"));
    const { owner: owner, repo: repo } = github.context.repo;

    const tagName = core.getInput('tag_name');
    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.replace("ref/tags/", "");
    const releaseName = core.getInput('release_name');
    const body = core.getInput('body');
    const draft = core.getInput('draft', { required: false }) === 'true';
    const prerelease = core.getInput('prerelease', { required: false }) === 'true';
    const comittisch = github.context.sha;

    console.log("Create Release for comittisch: " + comittisch)
    try{
      //Check for existing release
      const existingRelease = await octokit.repos.getReleaseByTag({
        owner,
        repo,
        tag
      });
        const {
          data: {id: releaseId, html_url: htmlUrl, upload_url: uploadUrl}
        } = existingRelease;
      await octokit.repos.deleteRelease({
        owner,
        repo,
        release_id: releaseId
      });
      const delRes = await octokit.git.deleteRef({
        owner,
        repo,
        ref: "tags/" + tag
      });
    }
    catch(error){
      console.log(error)
    }
    // Recreate the release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const createReleaseResponse = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body: body,
      draft,
      prerelease,
      target_commitish: comittisch
    });

    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = createReleaseResponse;
    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput('id', releaseId);
    core.setOutput('html_url', htmlUrl);
    core.setOutput('upload_url', uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
