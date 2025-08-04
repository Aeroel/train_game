const TERMUX_DIR = '/data/data/com.termux';

function isTermux() {
  return process.cwd().startsWith(TERMUX_DIR);
}

class Webpack_Plugin_To_Fix_Termux_Scandir_Issue {
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

module.exports = Webpack_Plugin_To_Fix_Termux_Scandir_Issue;
