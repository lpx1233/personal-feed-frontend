import { flatMap, map } from 'rxjs/operators';
import { forkJoin, from, zip, of } from 'rxjs';
import { ofType } from 'redux-observable';
import axios from 'axios';
import { setTopStories, addItems } from '../feed/Feed';

// fetch top stories
export const FETCH_TOP_STORIES = 'my-personal-feed/services/FETCH_TOP_STORIES';
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
export const FETCH_ITEMS_BY_IDS = 'my-personal-feed/services/FETCH_ITEMS_BY_IDS';
export function fetchItemsByIds(ids,
  addItemsParams = { appendToEnd: false, clearPrevious: false, currIdx: 0 }) {
  return {type: FETCH_ITEMS_BY_IDS, ids, addItemsParams};
}
export const fetchItemsByIdsEpic = action$ => action$.pipe(
  ofType(FETCH_ITEMS_BY_IDS),
  flatMap(action =>
    zip(
      of(action.addItemsParams),
      forkJoin(action.ids.map(id =>
        from(axios.get(`http://52.221.217.26:8080/id/${id}`).then(resp => resp.data))
      ))
    ).pipe(map(x => ({addItemsParams: x[0], items: x[1]})))
  ),
  map(({ addItemsParams, items }) => addItems(
    items.map(item => ({
      id: item.id,
      source: 'Hacker News',
      title: item.title,
      score: item.score,
      author: item.by,
      time: item.time,
      url: item.url,
      comments: item.kids !== undefined ? item.kids.length : undefined,
    })),
    addItemsParams.appendToEnd,
    addItemsParams.clearPrevious,
    addItemsParams.currIdx,
  )),
);