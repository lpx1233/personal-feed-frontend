import { flatMap, map } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';
import { ofType } from 'redux-observable';
import axios from 'axios';
import { setTopStories, appendItems } from '../feed/Feed';

// fetch top stories
const FETCH_TOP_STORIES = 'my-personal-feed/services/FETCH_TOP_STORIES';
export function fetchTopStories() {
  return { type: FETCH_TOP_STORIES };
}
export const fetchTopStoriesEpic = action$ => action$.pipe(
  ofType(FETCH_TOP_STORIES),
  flatMap(() =>
    axios.get('http://52.221.217.26:8080/topstories')
      .then(response => setTopStories(response.data))
  )
);

// fetch items
const FETCH_ITEMS_BY_IDS = 'my-personal-feed/services/FETCH_ITEMS_BY_IDS';
export function fetchItemsByIds(ids) {
  return {type: FETCH_ITEMS_BY_IDS, ids};
}
export const fetchItemsByIdsEpic = action$ => action$.pipe(
  ofType(FETCH_ITEMS_BY_IDS),
  map(action => action.ids),
  flatMap(ids => forkJoin(ids.map(id =>
    from(axios.get(`http://52.221.217.26:8080/id/${id}`).then(resp => resp.data))
  ))),
  map(items => appendItems(items.map(item => {
    return {
      id: item.id,
      source: 'Hacker News',
      title: item.title,
      score: item.score,
      author: item.by,
      time: item.time,
      url: item.url,
      comments: item.kids !== undefined ? item.kids.length : undefined,
    };
  })))
);