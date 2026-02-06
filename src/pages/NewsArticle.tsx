import { useParams, Navigate } from "react-router-dom";

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  
  // Redirect to the main news page with the article ID in the query params
  // This ensures the "popup" style is used instead of a standalone page
  return <Navigate to={`/news?articleId=${id}`} replace />;
}
