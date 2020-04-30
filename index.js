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
    const gasPrice = core.getInput('gasPrice');
    const dryrun = core.getInput('dryRun');
    const verbose = (core.getInput('verbose') === 'true');

    await updater.update({ mnemonic, rpc, name, contentHash, contentType, gasPrice, dryrun, verbose })
      .catch(error => { throw error });

    if (verbose) {
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2);
      console.log(`The event payload: ${payload}`);
    }
    process.exit(0);
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
}

run();