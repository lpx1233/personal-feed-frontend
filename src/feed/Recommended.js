import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ItemList from './ItemList';

// Apollo Client part
const GET_RECOMMENDATION = gql`
  query Recommended($userID: Int!, $len: Int!, $readBefore: [Int!]!) {
    recommended(userID: $userID, len: $len, readBefore: $readBefore) {
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

const GET_USERID_READHISTORY = gql`
  {
    userID @client
    readBefore @client
  }
`;

const Recommended = () => (
  <Query query={GET_USERID_READHISTORY}>
    {({ data: { userID, readBefore } }) => (
      <Query
        query={GET_RECOMMENDATION}
        variables={{ userID: userID, len: 10, readBefore: readBefore }}
        notifyOnNetworkStatusChange
      >
        {({ error, data, fetchMore, networkStatus, variables, client }) => {
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
          // store local state
          // TODO: if too slow, optimize in future
          var newReadBeforeSet = new Set(variables.readBefore);
          if (networkStatus == 7) {
            data.recommended.map((item) => {
              newReadBeforeSet.add(item.id);
            });
          }
          var newReadBefore = Array.from(newReadBeforeSet);
          if (networkStatus == 7) {
            client.writeData({
              data: {
                readBefore: newReadBefore
              }
            });
          }
          return (
            <ItemList
              error={Boolean(error)}
              status={status}
              itemList={data.recommended ? data.recommended.map((item) => ({
                id: item.id,
                title: item.title,
                score: item.score,
                author: item.by,
                time: item.time,
                url: item.url,
                comments: item.kids ? item.kids.length : 0,
              })) : []}
              loadFront={() => fetchMore({
                variables: {
                  userID: userID,
                  len: 10,
                  readBefore: newReadBefore,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return Object.assign({}, prev, {
                    recommended: [...fetchMoreResult.recommended, ...prev.recommended]
                  });
                }
              })}
              loadEnd={() => fetchMore({
                variables: {
                  userID: userID,
                  len: 10,
                  readBefore: newReadBefore,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return Object.assign({}, prev, {
                    recommended: [...prev.recommended, ...fetchMoreResult.recommended]
                  });
                }
              })}/>
          );
        }}
      </Query>
    )}
  </Query>
);

export default Recommended;