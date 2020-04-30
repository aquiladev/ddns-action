const core = require('@actions/core');
const github = require('@actions/github');

const updater = require('./updater');

async function run() {
  try {
    const mnemonic = core.getInput('mnemonic');
    const rpc = core.getInput('rpc');
    const name = core.getInput('name');
    const contentHash = core.getInput('contentHash');
    const contentType = core.getInput('contentType');
    const dryrun = (core.getInput('dryRun') === 'true');
    const verbose = (core.getInput('verbose') === 'true');

    await updater.update({ mnemonic, rpc, name, contentHash, contentType, dryrun, verbose })
      .catch(error => { throw error });

    if (verbose) {
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2);
      console.log(`The event payload: ${payload}`);
    }
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

module.exports = run;