const fs = require('fs');
const path = require('path'); //引入node的路径

function readFileListSync(dir, filesList = [], filesListMap = {}) {
  const files = fs.readdirSync(dir);
  // console.log(files);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    // console.log('---stat---:', stat.isDirectory(), stat.isFile(), fullPath)
    if (stat.isDirectory()) {
      readFileListSync(path.join(dir, item), filesList, filesListMap); //递归读取文件
    } else if (stat.isFile()) {
      const pureFileName = getRealFileNameExcludeHash(fullPath);
      // console.log('---pureFileName---:', pureFileName);
      filesList.push({
        file: fullPath,
        name: item,
        birthtime: stat.birthtime && stat.birthtime.getTime(),
        dtime:
          new Date().getTime() - (stat.birthtime && stat.birthtime.getTime()),
        pureFileName,
      });
      if (pureFileName) {
        let obj = {
          file: fullPath,
          name: item,
          birthtime: stat.birthtime && stat.birthtime.getTime(),
          dtime:
            new Date().getTime() - (stat.birthtime && stat.birthtime.getTime()),
          pureFileName,
        };
        if (filesListMap[pureFileName]) {
          filesListMap[pureFileName].push(obj);
        } else {
          filesListMap[pureFileName] = [obj];
        }
      }
    }
  });
  return {
    filesList,
    filesListMap,
  };
}
function getRealFileNameExcludeHash(name) {
  const groups = name && name.split('.');
  const len = groups.length;

  delete groups[len - 1];
  delete groups[len - 2];

  groups.length = len - 2;
  return groups.join('.');
}
class CleanDistWebpackPlugin {
  constructor(option = {}) {
    this.option = option;
    const { dTime } = option;
    this.dTime = dTime * 24 * 60 * 60 * 1000 || 1 * 24 * 60 * 60 * 1000;
  }

  apply(compiler) {
    // console.log('---this.option----:', this.option);
    const { allowRepeatCount, MODULE } = this.option || {};
    console.log(
      '---MODULE---:',
      MODULE,
      '------allowRepeatCount------',
      allowRepeatCount,
      '----dTime----:',
      this.dTime
    );
    compiler.hooks.emit.tapAsync(
      'CleanDistWebpackPlugin',
      (compilation, callback) => {
        // console.log(compilation.assets)
        /**
         * dist目录下的文件现在是非覆盖式发布 要定时清除旧文件
         */
        const dir = path.resolve(__dirname, `../../../dist/${MODULE}`);

        if (fs.existsSync(dir)) {
          let { filesList, filesListMap } = readFileListSync(dir, [], {});
          let allShouldDeleteFiles = [];
          // console.log('---filesListMap-----:', filesListMap);

          // filesList
          //     .sort((a, b) => {
          //         // 升序排列 从小到大
          //         return a.birthtime - b.birthtime
          //     });
          // sort 是改变原数组

          const keys = Object.keys(filesListMap);
          keys.forEach((name) => {
            let freshData = -1;
            if (name) {
              // 避免key 为 ''
              const items = filesListMap[name];
              if (name.indexOf('main') > -1) {
                // console.log('---items----:', items);
              }
              if (items && items.length > allowRepeatCount) {
                // console.log('--filesListMap[name].dtime---:', name, filesListMap[name].dtime, filesListMap[name].fullPath);

                items.sort((a, b) => {
                  // 升序排列 dtime从小到大 那么新鲜度 越高的排在前面
                  return a.dtime - b.dtime;
                });
                if (items[0]) {
                  if (items[0].dtime > this.dTime) {
                    const shouldDeleteFiles = filesListMap[name].slice(
                      allowRepeatCount,
                      items.length
                    );

                    allShouldDeleteFiles.push(...shouldDeleteFiles);
                  }
                } else {
                  items.forEach((file, index) => {
                    if (freshData < 0) {
                      if (file.dtime > this.dTime) {
                        if (freshData < 0) {
                          freshData = index;
                        }
                      }
                    }
                  });
                  if (freshData > 0) {
                    let canDeletedIndex = Math.max(allowRepeatCount, freshData);
                    const shouldDeleteFiles = filesListMap[name].slice(
                      canDeletedIndex,
                      items.length
                    );
                    // console.log('---canDeletedIndex---:', canDeletedIndex);
                    allShouldDeleteFiles.push(...shouldDeleteFiles);
                  }
                }
              }
            }
          });
          console.log('---allShouldDeleteFiles----:', allShouldDeleteFiles);
          // delete old file
          allShouldDeleteFiles.forEach((fileItem) => {
            const { file } = fileItem || {};
            console.log('---file----:', file);
            file && fs.unlinkSync(file);
          });
        }

        callback();
      }
    );
  }
}

module.exports = CleanDistWebpackPlugin;
