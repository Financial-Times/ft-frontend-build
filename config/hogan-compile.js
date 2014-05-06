module.exports = {
	files: [{
        src: './target/views/article/article.mustache',
        dest: 'article'
    },{
        src: './target/views/article/related-topic.mustache',
        dest: 'related-topic'
    }],
    mappings: {
        articleBody: '> /views/article/articleBody'
    }
};