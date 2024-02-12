const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Have you ever thought, “If I could be perfectly free, I would be happy; I would have peace”? Many people have sought complete freedom in order to have happiness and peace. People desire to be free of all restraints, somehow believing that if they could do just as they please, this would bring happiness. Does it?The laughter and carefree atmosphere prevalent in today’s society seem to offer the promise of happiness. The party life is so attractive to many. People with alcohol and all night to indulge with their companions feel assured of happiness. These settings do not provide the peace and happiness people are seeking.";
const aboutContent = "Welcome to Blogging Website, your go-to destination for insightful and engaging content that covers a wide array of topics. Whether you're passionate about technology, travel, food, lifestyle, or anything in between, we've got you covered.At Blogging Website, we believe in the power of storytelling to inspire, educate, and entertain. Our team of experienced writers and contributors are dedicated to delivering high-quality, thought-provoking articles that spark conversations and offer fresh perspectives.With a commitment to diversity and inclusivity, we strive to represent voices from all walks of life, ensuring that our content reflects the rich tapestry of human experiences.But we're more than just a platform for written content. Blogging website also serves as a community hub where readers can connect with like-minded individuals, share their thoughts and ideas, and engage in meaningful discussions.";
const contactContent = "We value your feedback, questions, and suggestions. Feel free to reach out to us via email at contact@websitename.com. Our dedicated team is here to assist you with any inquiries you may have.You can also connect with us on social media:Follow us on Twitter: @WebsiteName Like us on Facebook: /WebsiteName Find us on Instagram: @WebsiteNameOfficial Stay updated on the latest articles, news, and events by subscribing to our newsletter. Simply enter your email address below to join our community.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// Add a route to handle post deletion
app.post("/delete", function(req, res){
  const postIdToDelete = req.body.postId;

  // Use findOneAndDelete to find and delete the post
  Post.findOneAndDelete({_id: postIdToDelete}, function(err){
    if (!err){
      console.log("Successfully deleted the post.");
      res.redirect("/");
    } else {
      console.log(err);
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
