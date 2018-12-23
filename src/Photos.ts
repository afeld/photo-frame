import flatMap from "lodash.flatmap";
import uniqBy from "lodash.uniqby";

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
  const photosResponses = Object.values(json) as PhotosResponse[];
  return flatMap(photosResponses, photosFromUser);
};

export const onPhotosFetched = (responses: FBBatchResponse[]) => {
  const photos = flatMap(responses, photosFromBatch);
  return uniqBy(photos, photo => photo.id);
};

export const numFriends = (response: FBBatchResponse): number => {
  const json = JSON.parse(response.body);
  return json.data.length;
};

export const handleBatchResponse = (responses: FBBatchResponse[]) => {
  if (!numFriends(responses[0])) {
    console.log("No friends authorized.");
  }
  // exclude the friends' non-response
  const photoResponses = responses.slice(1) as FBBatchResponse[];
  return onPhotosFetched(photoResponses);
};

export function getPhotos(
  FB: fb.FacebookStatic,
  cb: (photos: pf.Photo[]) => void
) {
  const photoFields = "name,webp_images";
  // batch requests
  // https://stackoverflow.com/a/16001318/358804
  // https://developers.facebook.com/docs/graph-api/making-multiple-requests#operations
  // https://developers.facebook.com/docs/graph-api/advanced#largerequests
  FB.api(
    "/",
    "post",
    {
      include_headers: false,
      batch: [
        {
          method: "GET",
          name: "friends",
          omit_response_on_success: false,
          relative_url: "me/friends?fields=id"
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
      ]
    },
    (responses: FBBatchResponse[]) => {
      const photos = handleBatchResponse(responses);
      cb(photos);
    }
  );
}
