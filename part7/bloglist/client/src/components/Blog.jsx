import { Card, CardContent, Typography, Link, Button } from "@mui/material";
import useUser from "../hooks/useUser";

const Blog = ({ blog, addLike, removeBlog }) => {
  const { user } = useUser();
  if (!blog) {
    return null;
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography
          sx={{ color: "text.secondary", mb: 1.5 }}
          variant="subtitle1"
        >
          by {blog.author}
        </Typography>
        <Link href={blog.url}>{blog.url}</Link>
        <Typography
          sx={{ color: "text.secondary", mb: 1.5 }}
          variant="subtitle2"
        >
          Added by {blog.user.name}
        </Typography>
        <Typography variant="body1">
          {blog.likes} likes{" "}
          {user && (
            <Button onClick={() => addLike(blog)} variant="outlined">
              like
            </Button>
          )}
          {user && user.id === blog.user.id && (
            <Button
              onClick={() => removeBlog(blog)}
              variant="outline"
              color="error"
            >
              remove
            </Button>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Blog;
