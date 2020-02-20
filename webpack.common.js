

module.exports = {
entry:{main:"./src/index.js"},
module:{
    rules:[
        { 
        test:/\.html$/, 
        use:["html-loader"]},
        { 
            test:/\.(svg|png|jpg|gif)$/, 
            use:{loader:"file-loader",
            options:{name:"[name].[hash].[ext]",outputPath:"imgs"}
        }
    },
    {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
        cache: true
      }},
       {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }}}
]
 }
};

    
