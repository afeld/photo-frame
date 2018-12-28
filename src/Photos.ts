import { flatMap, uniqBy, values } from "lodash";

interface FBBatchResponse {
  body: string;
}

interface FBError {
  code: number;
  message: string;
}

interface FBErrorResponse {
  error: FBError;
}

interface FBBatchOpResponse {
  [userId: string]: PhotosResponse;
}

interface FriendsResponse {
  data: pf.User[];
}

interface PhotosResponse {
  data: pf.Photo[];
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
const isErrorResponse = (
  response: FBErrorResponse | any
): response is FBErrorResponse => {
  return (<FBErrorResponse>response).error !== undefined;
};

const photosFromUser = (response: FBErrorResponse | PhotosResponse) => {
  if (isErrorResponse(response)) {
    console.error(response.error.message);
    return [];
  }
  return response.data;
};

const photosFromBatch = (response: FBBatchResponse) => {
  const json = JSON.parse(response.body) as FBBatchOpResponse | FBErrorResponse;
  if (isErrorResponse(json)) {
    // this is due to no friends being authorized, which is handled elsewhere
    if (json.error.code !== 2500) {
      console.error(json.error.message);
    }
    return [];
  }
  // there is one key+value pair per user
  const photosResponses = values(json) as PhotosResponse[];
  return flatMap(photosResponses, photosFromUser);
};

export const onPhotosFetched = (responses: FBBatchResponse[]) => {
  const photos = flatMap(responses, photosFromBatch);
  return uniqBy(photos, photo => photo.id) as pf.Photo[];
};

const getFriends = (response: FBBatchResponse) => {
  const json = JSON.parse(response.body) as FriendsResponse;
  return json.data;
};

// https://developers.facebook.com/docs/graph-api/making-multiple-requests#operations
const fbBatchRequest = async (token: string, data: any[]) => {
  const formData = new FormData();
  formData.append("access_token", token);
  formData.append("include_headers", "false");
  formData.append("batch", JSON.stringify(data));

  const response = await fetch(`https://graph.facebook.com/`, {
    method: "POST",
    body: formData
  });
  return (await response.json()) as FBBatchResponse[];
};

export async function getFriendsAndPhotos(token: string) {
  const photoFields = "name,images";
  // https://developers.facebook.com/docs/graph-api/advanced#largerequests
  const responses = await fbBatchRequest(token, [
    {
      method: "GET",
      name: "friends",
      omit_response_on_success: false,
      relative_url: "me/friends?fields=id,link,name,picture"
    },

    // my tagged photos
    {
      method: "GET",
      relative_url: `photos?fields=${photoFields}&ids=me`
    },
    // my uploaded photos
    {
      method: "GET",
      relative_url: `photos?type=uploaded&fields=${photoFields}&ids=me`
    },

    // -- split from requests above so that own photos are retrieved even if user has no friends --

    // others' tagged photos
    {
      method: "GET",
      relative_url: `photos?fields=${photoFields}&ids={result=friends:$.data.*.id}`
    },
    // others' uploaded photos
    {
      method: "GET",
      relative_url: `photos?type=uploaded&fields=${photoFields}&ids={result=friends:$.data.*.id}`
    }
  ]);
  const friends = getFriends(responses[0]);

  // exclude the friends' response
  const photoResponses = responses.slice(1) as FBBatchResponse[];
  const photos = onPhotosFetched(photoResponses);

  return { friends, photos };
}
