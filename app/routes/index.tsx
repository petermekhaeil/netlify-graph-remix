import { Link, useLoaderData, json } from 'remix';
import slugify from 'slugify';
import NetlifyGraph from '../../netlify/functions/netlifyGraph';

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
type FetchIssuesResponse = Awaited<ReturnType<typeof NetlifyGraph.fetchIssues>>;

async function getLoaderData() {
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

  return json.data.gitHub.repository.issues.edges.map(({ node }) => {
    return {
      ...node,
      slug: slugify(node.title).toLowerCase()
    };
  });
}

export const loader = async () => {
  return json<LoaderData>(await getLoaderData());
};

export default function Index() {
  let data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <h1>Netlify Graph + Remix</h1>
      <p>
        This application demonstrates Remix using Netlify Graph to fetch data
        from GitHub. When a new issue is created in this{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/petermekhaeil/netlify-graph-remix"
        >
          repository
        </a>
        , it will be listed below as a blog post. Try it out!
      </p>
      <h2>Posts</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <Link to={item.slug}>{item.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        <small>
          Source code available on{' '}
          <a href="https://github.com/petermekhaeil/netlify-graph-remix">
            GitHub
          </a>
          .
        </small>
      </p>
    </div>
  );
}
