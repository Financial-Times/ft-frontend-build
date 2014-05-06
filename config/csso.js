module.exports = {
  prod: {
    files: {
      '<%= path.target %><%= static_assets_path.css %>main.css': ['<%= path.target %><%= static_assets_path.css %>main.css'],
      '<%= path.target %><%= static_assets_path.css %>core-comments.css': ['<%= path.target %><%= static_assets_path.css %>core-comments.css']
    }
  }
};