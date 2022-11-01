import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

// TODO: add schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: {
    type: String,
    unique: true,
    required: true,
  },
});

const ArticleSchema = mongoose.Schema({
  title: String,
  url: String,
  description: String,
});

// TODO: configure plugin
ArticleSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=title%>" });



// TODO: register models

const User = mongoose.model("User", UserSchema);
const Article = mongoose.model("Article", ArticleSchema);

mongoose.connect("mongodb://localhost/hw05").then((res) => console.log("Connected")).catch((err) => console.log(err));

export {
  User,
  Article
}
