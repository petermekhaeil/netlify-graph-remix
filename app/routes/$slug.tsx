import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import NetlifyGraph from '../../netlify/functions/netlifyGraph';
import slugify from 'slugify';
import parseFrontMatter from 'front-matter';
import { marked } from 'marked';

async function getLoaderData(slug?: string) {
  const { data } = await NetlifyGraph.fetchIssues(
    {},
    { accessToken: process.env.ONEGRAPH_AUTHLIFY_TOKEN }
  );

  const post = data.gitHub.repository.issues.edges.find(({ node }) => {
    return slugify(node.title).toLowerCase() === slug;
  });

  return post;
}

export const loader: LoaderFunction = async ({ params }) => {
  const post = await getLoaderData(params.slug);

  if (post) {
    const { body } = parseFrontMatter(post.node.body);
    const html = marked(body);
    return { slug: params.slug, html, title: post.node.title };
  }

  return null;
};

export default function PostSlug() {
  const slug = useLoaderData();

  return (
    <div>
      <h1>{slug.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: slug.html }} />
    </div>
  );
}
