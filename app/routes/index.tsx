import { Link, useLoaderData, json } from 'remix';
import slugify from 'slugify';
import NetlifyGraph from '../../netlify/functions/netlifyGraph';

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData() {
  const { data } = await NetlifyGraph.fetchIssues(
    {},
    { accessToken: process.env.ONEGRAPH_AUTHLIFY_TOKEN }
  );

  return data.gitHub.repository.issues.edges.map(({ node }) => {
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
