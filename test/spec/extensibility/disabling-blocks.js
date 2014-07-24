// var allBlocks = require('../../../lib/defaults').blocks;
// var specs = {};
// var stringArrayToString = function (arr) {
//     return '["' + arr.join('","') + '"]';
// };
// var bundles;

// allBlocks.forEach(function (block, index) {
//     if (index) return;
//     var blocks = allBlocks.slice();
//     blocks.splice(index, 1);
//     console.log(blocks);
//     specs[block] = {
//         structure: {
//             'ft-frontend-config.js': 'module.exports = { "blocks": ' + stringArrayToString(blocks) + ' }'
//         },
//         tasks: ['build'],
//         before: function () {
//             bundles = require('../../../lib/task-bundles');
//             Object.keys(bundles).forEach(function (bundle) {
//                 spyOn(bundles, bundle);
//             });
//         },
//         specs: function (result, done) {
            
//             Object.keys(bundles).forEach(function (bundle) {
//                 if (bundle === block) {
//                     console.log('asda1')
//                     expect(bundles[bundle]).not.toHaveBeenCalled();
//                     console.log('asda2')
//                 } else {
//                     console.log('asda3')
//                     expect(bundles[bundle]).toHaveBeenCalled();
//                     console.log('asda4')
//                 }
//                 done();
//             });
//         }
//     };
// });

// module.exports = {
//     structure: {},
//     specs: specs
// };