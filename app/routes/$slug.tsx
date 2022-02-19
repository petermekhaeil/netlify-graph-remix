import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import NetlifyGraph from '../../netlify/functions/netlifyGraph';
import slugify from 'slugify';
import parseFrontMatter from 'front-matter';
import { marked } from 'marked';

type FetchIssuesResponse = Awaited<ReturnType<typeof NetlifyGraph.fetchIssues>>;

async function getLoaderData(slug?: string) {
  // Netlify Graph's `ONEGRAPH_AUTHLIFY_TOKEN` variable does not
  // seem to be available in production.
  // Possible reason: https://github.com/netlify/labs/issues/26
  // Workaround: Fetch data using Netlify Functions which seems
  // to have Netlify Graph authentication working.
  const res = await fetch(
    'https://netlify-graph-remix.netlify.app/.netlify/functions/github'
  );

  const json: FetchIssuesResponse = await res.json();

  // Once `ONEGRAPH_AUTHLIFY_TOKEN` is working again in production,
  // we can remove the above workaround and uncomment the below code:
  // const { data } = await NetlifyGraph.fetchIssues(
  //   {},
  //   { accessToken: process.env.ONEGRAPH_AUTHLIFY_TOKEN }
  // );

  const post = json.data.gitHub.repository.issues.edges.find(({ node }) => {
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
    <div className="container">
      <h1>{slug.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: slug.html }} />
    </div>
  );
}
