const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Our fellow programmers preparing for interviews are always on the lookout for famous interview questions to sharpen their skills and boost their confidence. Some classic questions that often come up include challenges like implementing data structures and algorithms, solving coding problems efficiently, and explaining the intricacies of object-oriented programming.Taking inspiration from renowned tech companies like Google, Microsoft, and Amazon can be beneficial, as their interview questions are widely studied and respected in the industry. ";
const aboutContent = "Welcome to our collaborative platform for interview questions! Here, programmers from all backgrounds can contribute their experiences and share interview questions they've encountered along with the companies that asked them. Whether you're preparing for technical interviews or looking to expand your knowledge, this website serves as a valuable resource. Users can browse through a diverse range of questions asked by renowned companies such as Google, Facebook, Amazon, and more, gaining insights into the types of challenges they may face during interviews. By crowdsourcing questions, we create a comprehensive database that empowers programmers to prepare effectively and confidently for their next interview. Whether you're a seasoned developer or just starting your journey, everyone is welcome to contribute and benefit from the collective knowledge shared here. Let's build a community where programmers help each other succeed!";
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
