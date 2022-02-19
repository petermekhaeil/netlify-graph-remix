// GENERATED VIA NETLIFY AUTOMATED DEV TOOLS, EDIT WITH CAUTION!

export type NetlifyGraphFunctionOptions = {
  /**
   * The accessToken to use for the request
   */
  accessToken?: string;
  /**
   * The siteId to use for the request
   * @default process.env.SITE_ID
   */
  siteId?: string;
};

export type WebhookEvent = {
  body: string;
  headers: Record<string, string | null | undefined>;
};

export type GraphQLError = {
  path: Array<string | number>;
  message: string;
  extensions: Record<string, unknown>;
};

export type IssuesInput = {
  /**
   * The login field of a user or organization
   */
  owner?: string;
  /**
   * The name of the repository
   */
  name?: string;
};

export type Issues = {
  /**
   * Any data from the function will be returned here
   */
  data: {
    gitHub: {
      /**
       * Lookup a given repository by the owner and repository name.
       */
      repository: {
        /**
         * A list of issues that have been opened in the repository.
         */
        issues: {
          /**
           * A list of edges.
           */
          edges: Array<{
            /**
             * The item at the end of the edge.
             */
            node: {
              id: string;
              /**
               * Identifies the body of the issue.
               */
              body: string;
              /**
               * A list of labels associated with the object.
               */
              labels: {
                /**
                 * A list of edges.
                 */
                edges: Array<{
                  /**
                   * The item at the end of the edge.
                   */
                  node: {
                    id: string;
                    /**
                     * Identifies the label name.
                     */
                    name: string;
                  };
                }>;
              };
              /**
               * Identifies the issue title.
               */
              title: string;
              /**
               * Identifies the date and time when the object was created.
               */
              createdAt: unknown;
              /**
               * A list of Reactions left on the Issue.
               */
              reactions: {
                /**
                 * A list of edges.
                 */
                edges: Array<{
                  /**
                   * The item at the end of the edge.
                   */
                  node: {
                    id: string;
                  };
                }>;
              };
              /**
               * A list of comments associated with the Issue.
               */
              comments: {
                /**
                 * A list of nodes.
                 */
                nodes: Array<{
                  /**
                   * The body as Markdown.
                   */
                  body: string;
                  /**
                   * Identifies the date and time when the object was created.
                   */
                  createdAt: unknown;
                  id: string;
                  /**
                   * The actor who authored the comment.
                   */
                  author: {
                    /**
                     * A URL pointing to the actor's public avatar.
                     */
                    avatarUrl: string;
                    /**
                     * The username of the actor.
                     */
                    login: string;
                  };
                  /**
                   * The HTTP URL for this issue comment
                   */
                  url: string;
                }>;
              };
              /**
               * The HTTP URL for this issue
               */
              url: string;
            };
          }>;
        };
      };
    };
  };
  /**
   * Any errors from the function will be returned here
   */
  errors: Array<GraphQLError>;
};

/**
 * Fetch repo issues
 */
export function fetchIssues(
  variables: IssuesInput,
  options?: NetlifyGraphFunctionOptions
): Promise<Issues>;
