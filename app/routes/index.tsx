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
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <Link to={item.slug}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
