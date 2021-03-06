var express = require('express')
var port = 3000
var path = require('path')
var bodyParser = require('body-parser')
var _ = require('underscore')
var mongoose = require('mongoose')
var Movie = require('./models/movie.js')
var app = express()


mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')
// app.use(express.bodyParser())
// app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }))//将表单数据格式化
app.use(express.static(path.join(__dirname,'bower_components')))//告诉浏览器请求样式就到此文件夹查找，dirname就是当前目录
app.listen(port)
app.locals.moment = require('moment')

console.log('imooc started on port:' + port)

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err)
		}
	
		res.render('index',{
			title:'imovie 首页',
			movies:movies
		})
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err,movie){
		if (err) {
			console.log(err)
		}
		res.render('detail',{
			title:'imovie' + movie.title,
			movie:movie
		})
	})
	
})

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imovie 后台录入页',
		movie:{
			title: '',
			doctor: '',
			country: '',
			year: '',
			language: '',
			summary: '',
			poster: '',
			flash: ''
		}
	})
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if (id) {
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imovie 后台更新页',
				movie:movie
			})
		})
	}
})
//admin post movie
// admin post movie
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
 
  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }
 
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
 
        res.redirect('/movie/' + movie._id)
      })
    })
  }
  else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
 
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
 
      res.redirect('/movie/' + movie._id)
    })
  }
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err)
		}

		res.render('list',{
			title:'imovie 列表页',
			movies:movies
		})
	})
})

//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if (id) {
		Movie.remove({_id:id},function(err,movie){
			if (err) {
			console.log(err)
			}

			else{
				res.json({success:1})
			}
		})
	};
})