// ********* IMPORTANT NOTE *********** //
// There is a shorthand for grunt parallel e.g. tasks: ['parallel:test', 'buildStatics']
// DO NOT USE THIS SHORTHAND AS IT FAILS TO PERSIST THE ASSET VERSION NUMBER. IT WON'T BREAK
// ANY BUILD BUT WILL CAUSE STATIC ASSETS TO BE SAVED IN THE WRONG LOCATION ON CI, PROD ETC.
module.exports =  {
    options: {
      stream: true
    },
    ci: {
        tasks: [{
            grunt: true,
            args: ['test', '--ft.assetVersion=<%= ft.assetVersion %>']
        }, {
            grunt: true,
            args: ['build', '--ft.assetVersion=<%= ft.assetVersion %>']
        }]
    }
};