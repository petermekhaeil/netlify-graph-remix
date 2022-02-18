import NetlifyGraph from '../../netlify/functions/netlifyGraph';

const handler = async (event) => {
  const { data, error } = await NetlifyGraph.fetchIssues(
    {},
    { accessToken: event.authlifyToken }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ data, error })
  };
};

export { handler };
