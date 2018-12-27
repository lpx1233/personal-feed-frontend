import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ItemList from './ItemList';

// Apollo Client part
const GET_TOP_STORIES = gql`
  query TopStories($from: Int!, $len: Int!) {
    topstories(from: $from, len: $len) {
      id
      title
      score
      by
      time
      kids
      url
    }
  }
`;

const TopStories = () => (
  <Query
    query={GET_TOP_STORIES}
    variables={{ from: 0, len: 10 }}
    notifyOnNetworkStatusChange
  >
    {({ error, data, refetch, fetchMore, networkStatus, variables }) => {
      // deal with status
      var status = 'idle';
      switch (networkStatus) {
        case 1:
        case 4:
          status = 'loadFront';
          break;
        case 3:
          status = 'loadEnd';
          break;
        default:
          status = 'idle';
      }
      return (
        <ItemList
          error={Boolean(error)}
          status={status}
          itemList={data.topstories ? data.topstories.map((item) => ({
            id: item.id,
            title: item.title,
            score: item.score,
            author: item.by,
            time: item.time,
            url: item.url,
            comments: item.kids ? item.kids.length : 0,
          })) : []}
          loadFront={refetch}
          loadEnd={() => fetchMore({
            variables: {
              from: variables.from + variables.len,
              len: 10,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                topstories: [...prev.topstories, ...fetchMoreResult.topstories]
              });
            }
          })}/>
      );
    }}
  </Query>
);

export default TopStories;