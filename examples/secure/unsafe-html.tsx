// SECURE EXAMPLE

import DOMPurify from 'isomorphic-dompurify';

declare function getComment(id: string): Promise<{ author: string; bodyHtml: string }>;

export default async function CommentPage({ params }: { params: { id: string } }) {
  const comment = await getComment(params.id);
  // Sanitize with a maintained library and a restrictive allowlist.
  const safeHtml = DOMPurify.sanitize(comment.bodyHtml, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'code'],
    ALLOWED_ATTR: ['href'],
  });
  return (
    <article>
      {/* Text children are escaped by React. */}
      <h2>{comment.author}</h2>
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </article>
  );
}
