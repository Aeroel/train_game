/*
Purpose: When running webpack watch mode on termux, webpack apparently tries accessing root folders like / and /data/data, etc. It is unable to access them and it reports this and retries this over and over, spamming the console with these messages.
  This is very inconvenient.
  Although it does not seem to have any discernible negative effect on the actual functionality of the watcher.
  
  Anyway, the script below is supposed to fix this. I am not 100 percent sure what it does but it basically seems to delete the paths that can be taken out of the TERMUX_DIR constant below, so, I assume, like, /, /data, /data/data, etc, and removes them from webpack.
  I found this on some random website, maybe on Github.
  It seems to work pretty well.
*/

const TERMUX_DIR = '/data/data/com.termux';

function isTermux() {
  return process.cwd().startsWith(TERMUX_DIR);
}

class Plugin_To_Prevent_Webpack_From_Scanning_Inaccessible_Android_Folders {
  apply(compiler) {
    if (!isTermux()) return;

    const lookupDirs = [];
    for (const item of TERMUX_DIR.split('/')) {
      const dir = (lookupDirs.length > 0 ? lookupDirs[lookupDirs.length - 1] : '') + '/' + item;
      lookupDirs.push(dir.replace(/^\/\//, '/'));
    }
    const lookupSet = new Set(lookupDirs);

    compiler.hooks.done.tap('TermuxIssueResolve', (stats) => {
      for (const item of stats.compilation.fileDependencies) {
        if (lookupSet.has(item)) {
          console.log('[TermuxIssueWebpackPlugin] remove unaccessible fileDependency', item);
          stats.compilation.fileDependencies.delete(item);
        }
      }
    });
  }
}

module.exports = Plugin_To_Prevent_Webpack_From_Scanning_Inaccessible_Android_Folders;
