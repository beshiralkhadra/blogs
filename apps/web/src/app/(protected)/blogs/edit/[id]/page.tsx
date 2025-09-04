import BlogForm from '../../components/BlogForm';

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return <BlogForm blogId={params.id} />;
}
