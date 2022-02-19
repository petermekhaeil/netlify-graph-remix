import { useCatch, useLoaderData } from 'remix';
import type { LinksFunction, LoaderFunction } from 'remix';
import NetlifyGraph from '../../netlify/functions/netlifyGraph';
import slugify from 'slugify';
import parseFrontMatter from 'front-matter';
import { marked } from 'marked';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

import stylesUrl from '~/styles/post.css';

type FetchIssuesResponse = Awaited<ReturnType<typeof NetlifyGraph.fetchIssues>>;
type LoaderData = Awaited<ReturnType<typeof getLoaderData>> & {
  slug: string;
  html: string;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

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

  return post?.node;
}

export const loader: LoaderFunction = async ({ params }) => {
  const post = await getLoaderData(params.slug);

  if (!post) {
    throw new Response('Post not found', {
      status: 404
    });
  }

  const { body } = parseFrontMatter(post.body);
  const html = marked(body);
  return {
    ...post,
    slug: params.slug,
    html
  };
};

export default function PostSlug() {
  const post = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className="comments-container">
        <h2>Comments</h2>
        <a target="_blank" rel="noreferrer" href={post.url}>
          Leave a new comment
        </a>
        {post.comments.nodes.map((comment: any) => (
          <div key={comment.id} className="comment">
            <div className="comment-image">
              <img
                src={comment.author.avatarUrl}
                alt={comment.author.login}
                height={40}
                width={40}
              />
            </div>
            <div className="comment-content">
              <div className="comment-timestamp">
                <b>{comment.author.login}</b> commented{' '}
                {timeAgo.format(new Date(comment.createdAt))}
              </div>
              <div
                className="comment-body"
                dangerouslySetInnerHTML={{ __html: marked(comment.body) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">This post was not found. Sorry.</div>
    );
  }

  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      There was an error loading this post. Sorry.
    </div>
  );
}
